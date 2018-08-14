# UASB - MDWEB
## Ejercicios para aprender GIT

Proyecto definido para realizar paso a paso los ejercicios que permiten al maestrante aprender GIT de manera sencilla.

## Temario
- [Sesión 1](#sesión-1)
  - [Configuración de GIT](#configuración-de-git)
  - [Comandos básicos](#comandos-básicos-1er-parte)
    - [Inicializar un repositorio](#1-inicializar-un-repositorio)
    - [Status](#2-estatus)
    - [Agregar archivos al stage](#3-agregar-archivos-al-escenario-stage)
    - [Consolidar la información](#4-consolidar-la-información-commitear)
    - [Comodines de git add](#5-comodines-de-git-add)
    - [Add y commit juntos](#6-add-y-commit-juntos)
    - [Borrar archivos](#7-borrar-archivo)
    - [Mover archivos o cambiar nombres](#8-mover-archivos-o-cambiar-nombres)
    - [Cambios entre versiones](#9-cambios-entre-versiones)
    - [Historial](#10-historial-log)
    - [Revisar cambios entre dos commits](#11-revisar-los-cambios-entre-dos-commits)
    - [Log con estadísticas](#12-log-con-estadísticas)
    - [Log con datos de cambios](#13-log-con-datos-de-cambios)
    - [Log con formato](#14-log-con-formato)
    - [Historial entre fechas](#15-historial-entre-fechas)
    - [Historial por autor](#16-historial-por-autor)
- [Sesión 2](#sesión-2)
  - [Comandos básicos](#comandos-básicos-2da-parte)
    - [Quitar archivos del stage](#17-quitar-archivos-del-stage)
    - [Cancelar los cambios](#18-cancelar-los-cambios)
    - [Corregir el último commit](#19-corregir-commits)
  - [Remotos](#remotos)


## Sesión 1

### Configuración de GIT

1. Configurar en Git cual será el nombre de la persona que hará uso de él  
`git config --global user.name "Pedro Perez"`  

    *Si se quiere configurar solo para el repositorio actual no se debe usar la bandera **--global***

2. Git hace uso del email del usuario cuando consolida la información, por esta razón necesitamos configurarlo  
`git config --global user.email "pedroperez@ejemplo.com"`  

    *Si se quiere configurar solo para el repositorio actual no se debe usar la bandera **--global***

3. Revisar la configuración  
`git config --list`  

### Comandos básicos (1er parte)

#### 1. Inicializar un repositorio  
Un repositorio es una carpeta o conjunto de carpetas que contienen archivos. Podemos crear una carpeta y luego iniciar el repositorio dentro.  
`mkdir sesion1 && cd sesion1`  
`git init`  

#### 2. Estatus
Identifica si existe un archivo modificado o no en nuestro repositorio. Esto es importante ya que hay que ubicar los archivos en el escenario antes de consolidarlos en la base de datos.  
`git status`  

#### 3. Agregar archivos al escenario ("stage")
Creamos un archivo y agregamos contenido en él  
`touch primer-archivo`  
`echo 'Hola Mundo' >> primer-archivo`  

Agregamos los archivos al stage  
`git add primer-archivo`  

Al ejecutar el comando **git add primer-archivo** estamos confirmando (agregando el archivo al escenario) que los cambios que realizamos sobre primer-archivo se quieren respaldar la próxima vez que consolidemos la información.

#### 4. Consolidar la información ("commitear")
Después de agregar archivos, podemos confirmarlo con git status  
`git status`  

Ahora solo nos queda agregar un mensaje para identificar claramente lo que ha sucedido en ese punto de la historia.

¿Qué poner en el mensaje del commit?
 - Resume los cambios en 72 caracteres o menos
 - Brinca una linea en blanco
 - Describe detalladamente los cambios, puedes usar bullets
 - Sigue una guía con base a tu proyecto
Para consolidar el archivo previamente creado y puesto en escenario.

```
git commit -m "Agregar primer archivo al repositorio

Este es un archivo creado con texto
Y el commit es un mensaje conciso y claro, ademas de este detallado"
```

*La bandera **-m** indica que se debe consolidar el archivo con un mensaje informativo.*

#### 5. Comodines de git add
- `git add -A` / `git add .`: Agrega todos
- `git add --ignore-removal`: Agrega nuevos y modificados, sin los eliminados
- `git add -u`: Agrega modificados y eliminados, sin los nuevos

Agregamos ahora múltiples archivos
```
touch segundo-archivo.js
echo 'console.log("Hola Mundo");' >> segundo-archivo.js

touch tercer-archivo.md
echo '# Hola Mundo' >> tercer-archivo.md

touch cuarto-archivo.py
echo 'print "Hola Mundo"' >> cuarto-archivo.py
```

Editemos el primer archivo  
`echo 'Segunda linea en el archivo' >> primer-archivo`  

Veamos el status actual del proyecto  
`git status`  

Si ahora queremos agregar todos estos cambios a la historia podemos hacer uso de diferentes cosas.

- Agregar solo el cambio del primer archivo  
`git add -u`  
`git status`

- O por el contrario, agregar tanto los cambios como los nuevos archivos  
`git add .`  
`git status`

Ahora solo nos falta hacer commit de estos cambios  
`git commit -m'Agregando multiples archivos y nueva linea en el primer archivo'`

#### 6. Add y Commit juntos

Editemos el primer archivo de nuevo  
`echo 'Una tercera linea' >> primer-archivo`

Creemos un nuevo archivo
```
touch quinto-archivo.html
echo '<h1>Hola Mundo</h1>' >> quinto-archivo.html
```

Para hacer las cosas mas rápidas, puedes hacer un add y un commit en un solo comando.  
```
git commit -a -m 'Edición de primer archivo

Nota: este commit no incluye el quinto archivo'
```  

*La bandera **-a** agrega los archivos modificados y eliminados, pero **no** los nuevos*

Para incluir todo los cambios, podrías ejecutar los dos comandos, pero en una misma linea.  
`git add . && git commit -m 'Este commit si tiene todos los cambios'`


#### 7. Borrar archivo
Borramos el primer archivo
```
rm primer-archivo
git status
```

**git rm** sirve para borrar un archivo pero en este caso sirve para agregar al escenario el archivo que vayamos a borrar
```
git rm primer-archivo
git status
```

Hacemos commit de la eliminación del archivo.  
`git commit -m'Eliminación de primer archivo'`

*También se puede seguir utilizando **git add .** sin embargo **git rm** es mas específico.*

#### 8. Mover archivos o cambiar nombres
Renombramos el quinto archivo para que su nombre sea index.html
```
mv quinto-archivo.html index.html
git status
```

Podemos ver que internamente el sistema operativo borra quinto-archivo.html y crea uno nuevo llamado index.html.

El proceso podria ser por separado eliminando el archivo con git rm y agregando el otro con git add.
```
git rm quinto-archivo.html
git add index.html
git status
```

También podemos hacerlo directo con git mv
```
git mv quinto-archivo.html index.html
git status
```

Pero en este caso, lo mas sencillo es hacer **git add .**
`git add . && git commit -m 'Renombrado archivo html'`

#### 9. Cambios entre versiones
Identifica todos los cambios de un archivo entre diferentes versiones.

Primero, hagamos cambios en uno de nuestros archivos
```
echo '<h2>Subtitulo</h2>' >> index.html
git status
```

Veremos que tenemos cambios pendientes por agregar al stage, pero no es claro cuáles son los cambios, por lo cual, haremos un diff

`git diff`

Este mostrará los cambios que existen entre el último commit y el estatus actual de los archivos.

#### 10. Historial (log)
Ver el historial de cambios de nuestro repositorio  
`git log`

Es utilizado para ver el historial de cambios de nuestro repositorio. Esto incluye información sobre el autor de los cambios, el mensaje breve utilizado, la fecha en que se realizó y el número de serial (hash).

*Si en tu terminal se queda abierto el git log, puedes navegar con las flechas hacia abajo para ver todo el contenido*

*Para cerrar el log, presiona **q***

#### 11. Revisar los cambios entre dos commits
Podemos ver los cambios entre nuestros commits con git diff y usando los hash de cada uno.  
`git diff hash1 hash2`

#### 12. Log con estadísticas
`git log --stat`  
Muestra los archivos y las estadisticas de cambios en cada uno de ellos.

#### 13. Log con datos de cambios
`git log -p`
Muestra las líneas donde se realizaron los cambios

Se puede además mostrar los cambios solo del último commit o de cierto número de commits  
`git log -p -1`

*La bandera **-1** se utiliza para observar únicamente lo último que fue commiteado.*

#### 14. Log con formato
`git log --pretty=format:"%h - %an - %ar - %s" --graph`  
*Se pueden utilizar todas las banderas para cambiar las salidas*

#### 15. Historial entre fechas
Ver el historial de cambios de nuestro repositorio entre fechas

`git log --since="2018-08-13"`  
Es utilizado para ver el historial de cambios de nuestro repositorio. Despues de la fecha.

`git log --before="2018-08-13"`  
Es utilizado para ver el historial de cambios de nuestro repositorio. antes de la fecha.

#### 16. Historial por autor
Ver el historial de cambios de nuestro repositorio por autor

`git log --author=nombre`  

Es utilizado para ver el historial de cambios de nuestro repositorio.

## Sesión 2

### Comandos básicos (2da parte)

Para esta sección crearemos un nuevo folder y trabajaremos en el.

`mkdir sesion2`  

#### 17. Quitar archivos del stage

Crearemos un archivo con contenido y lo agregamos al stage
```
echo 'Un testo aleatorio' >> 'sesion2/archivo.txt'
git status
git add .
```
¿Qué sucede si de repente ya no queremos esos cambios en el stage?

La lógica induce a que lo bajemos del escenario y eso es precisamente lo que hace git reset.

```
git status
git reset HEAD sesion2/archivo.txt
git status
```

#### 18. Cancelar los cambios
Modifiquemos algún archivo de nuestra primer sesión  
`echo 'Un texto aleatorio' >> 'sesion1/index.html'`

¿Qué pasaría si ahora nos arrepentimos de esa última modificación en nuestro archivo que aún no commiteamos y la quisiéramos eliminar?

```
git status
git diff
git checkout -- sesion1/index.html
git status
```

#### 19. Corregir commits
Hagamos commit de nuestro archivo
```
git status
git add sesion2/archivo.txt
git commit -m'Primer archivo de la sesion 2'
```

Modifiquemos nuestro archivo.txt para corregir el error de ortografía que teníamos en `testo`!

Ahora, podemos agregar un nuevo commit con el cambio, o simplemente modificar el último commit.

Frecuentemente cuando trabajamos y consolidamos los cambios olvidamos agregar al escenario algún archivo o simplemente lo modificamos tarde y lo queremos agregar a la información consolidada anteriormente.

`git commit --amend --no-edit`

Existen otras ocasiones en las que por el contrario, lo que queremos modificar es el mensaje del commit.

Hagámoslo para que el mensaje mencione la extensión del archivo.

`git commit --amend -m'Primer archivo txt agregado en la sesión 2'`

Hagamos un cambio aún mas drástico, queremos subir en realidad dos archivos txt.

```
echo 'Un segundo archivo' >> 'sesion2/archivo2.txt'
```

Y hagamos el commit pero editando el anterior

```
git status
git add .
git commit --amend -m'Primeros archivos txt agregados en la sesión 2'
```

### Remotos
