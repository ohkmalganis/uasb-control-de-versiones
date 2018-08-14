'use strict';

module.exports = function(CAcl) {
  function errors(err, code, status) {
    var error = new Error();
    error.statusCode = code;
    error.message = err;
    error.code = code;
    return error;
  };

  function parseDataJson(data) {
    var temp = JSON.stringify(data);
    return JSON.parse(temp);
  };

  function getPermissions() {
    var Q = require('q');
    var deferred = Q.defer();
        // datos de usuario
    var _ = require('lodash');
    var LoopBackContext = require('loopback-context');
    var ctxx = LoopBackContext.getCurrentContext();
    var accessToken = ctxx && ctxx.get('accessToken');
    var userId = (accessToken && accessToken.userId) ? accessToken.userId : null;

    if (userId) {
        CAcl.app.models.user.findOne({
            where: {id: userId},
            include: 'roles',
          }).then(function(user) {
              user = parseDataJson(user);
              var roles = _.map(user.roles, 'id');
                //console.log(user);
              CAcl.app.models.Offices.find({
                where: {
                    id: {inq: user.assignedOffices},
                  },
                include: 'type',
              }).then(function(offices) {
                  var officesType = _.compact(_.map(offices, 'officeTypeId'));
                  CAcl.find({
                    where: {
                        or: [
                                {rolId: {inq: roles}},
                                {office_type_id: {inq: officesType}},
                          ],
                      },
                  }).then(function(perms) {
                      deferred.resolve({offices: offices, perms: perms, roles: user.roles});
                    }, function(err) {
                      deferred.reject(err);
                    });
                }, function(err) {
                  deferred.reject(err);
                });
            }, function(err) {
              deferred.reject(err);
            });
      } else {
        deferred.reject(errors('Usuario no identificado', 401, 'Unauthorized'));
      }
    return deferred.promise;
  }
  CAcl.treePermissions = function(cb) {
    var _ = require('lodash');
    function getCrudModel(rol, perms) {
        var crud = [], aux = _.find(perms, {rolId: rol});
        crud.push(aux.c ? 'C' : null);
        crud.push(aux.r ? 'R' : null);
        crud.push(aux.u ? 'U' : null);
        crud.push(aux.d ? 'D' : null);
        return _.compact(crud);
      };

    getPermissions().then(function(resp) {
        var resp = _.map(resp.offices, function(offi) {
            if (offi.officeTypeId) {
                var myPerms = _.filter(resp.perms, {officeTypeId: offi.officeTypeId});
                var myModels = _.uniq(_.map(myPerms, 'objeto'));
                return {
                    id: offi.id,
                    office: offi.office,
                    officeTypeId: offi.officeTypeId,
                    officeDepId: offi.officeDepId,
                    models: _.map(myModels, function(model) {
                        var myPerms2 = _.filter(myPerms, {objeto: model});
                        var myRoles = _.uniq(_.map(myPerms2, 'rolId'));
                        return {
                            model: model,
                            roles: _.map(myRoles, function(rol) {
                                return {
                                    id: rol,
                                    name: _.find(resp.roles, {id: rol}).name,
                                    crud: getCrudModel(rol, myPerms2),
                                  };
                              }),
                          };
                      }),
                  };
              } else {
                return null;
              }
          });
        cb(null, _.compact(resp));
      }, function(err) {
        cb(err);
      });

        // CAcl.app.models.CRoleMapping.find({where:{userId: userId}}).then(function(resp) {

        // });
  };

  CAcl.remoteMethod('treePermissions', {
    http: {
        verb: 'get',
      },
    returns: {
            //arg: 'data',
        root: true,
        type: 'array',
      },
  });

  CAcl.operationAllow = function(model, operation, cb) {
    var _ = require('lodash');
    operation = operation.toLowerCase();
    function allowOperation(operation, perms) {
        var allow = false;
        _.forEach(perms, function(perm) {
            if (perm[operation]) {
                allow = true;
              }
          });
        return allow;
      };

    getPermissions().then(function(resp) {
        var perms = _.filter(resp.perms, {objeto: 'user'});
        cb(null, allowOperation(operation, perms));
      }, function(err) {
        cb(err);
      });
  };

  CAcl.remoteMethod('operationAllow', {
    accepts: [{
        arg: 'model',
        type: 'string',
        required: true,
      }, {
          arg: 'operation',
          type: 'string',
          required: true,
        }],
    http: {
        verb: 'get',
      },
    returns: {
        root: true,
        type: 'boolean',
      },
  });
};

