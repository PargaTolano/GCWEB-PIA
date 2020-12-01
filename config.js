/*=============================================
El process es un objeto global que corre en todo el entorno de desarrollo de nodeJS
=============================================*/
process.env.HOST = process.env.HOST || '0.0.0.0';

process.env.PORT = process.env.PORT || 4000;

process.env.SECRET = "laomnipotentepoderosakeysecretademipia123";

//un año para la caducidad
process.env.EXPIRE = 2.628e+6;