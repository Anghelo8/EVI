from flask import Flask, render_template, request, jsonify, flash, redirect, session, url_for
from flask_mysqldb import MySQL
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, template_folder='templates', static_folder='static')

app.secret_key = 'tu_clave_secreta_aqui_para_flash_messages_y_sesiones_seguras' # ¡IMPORTANTE: Cambia esto!

# Configuración de Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'josesitoenterprise880'
app.config['MAIL_PASSWORD'] = 'mqrn hzaf hojq txyh'
app.config['MAIL_DEFAULT_SENDER'] = 'josesitoenterprise880'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor' # ← Esta es la clave

# Inicializa Flask-Mail
mail = Mail(app)

# Configuración de MySQL (ya la tienes)
app.config['MYSQL_HOST'] = 'database-1.c9e4y28qu4dw.us-east-1.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = '23032007lu'
app.config['MYSQL_DB'] = 'dbVulcanizadora'

mysql = MySQL(app)

# --- RUTAS ORIGINALES (Mantenidas) ---
# app.py - FORZAR MOSTRAR SPLASH (para testing)
# app.py - FORZAR MOSTRAR SPLASH (para testing)

@app.route('/index')
def index():
    return render_template('index.html')
@app.route('/')
def splash():
    return render_template('splash.html')

@app.route('/somos')
def somos():
    return render_template('somos.html')

@app.route('/service')
def service():
    return render_template('service.html')

@app.route('/services')
def services():
    service_history = [
        {'type': 'Parchado de llantas', 'date': '2025-05-10', 'description': 'Se reparó un pinchazo en la llanta delantera derecha.', 'status': 'Completado'},
        {'type': 'Cambio de llantas', 'date': '2025-04-25', 'description': 'Se instalaron cuatro llantas nuevas.', 'status': 'Completado'},
        {'type': 'Inflado de llantas', 'date': '2025-05-14', 'description': 'Revisión y ajuste de la presión de las cuatro llantas.', 'status': 'Pendiente'}
    ]
    return render_template('services.html', service_history=service_history)

@app.route('/formulario')
def formulario():
    return render_template('formulario.html')

@app.route('/carrito')
def carrito():
    return render_template('carrito.html')

@app.route('/productos')
def productos():
    return render_template('productos.html')
# Definición de la ruta para el blog
@app.route('/blog')
def blog():
    """
    Renderiza la página del blog de la vulcanizadora.
    """
    return render_template('blog.html')


@app.route('/exitoso')
def exitoso():
    return render_template('exitoso.html')
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Obtener datos del formulario
        nombre = request.form.get('nombre')
        apellidos = request.form.get('apellidos')
        email = request.form.get('email')
        telefono = request.form.get('telefono')
        direccion = request.form.get('direccion')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        recibir_promociones = 1 if request.form.get('recibir_promociones') else 0

        # Validar campos obligatorios
        if not all([nombre, apellidos, email, telefono, direccion, password, confirm_password]):
            flash("Todos los campos son obligatorios.", "error")
            return render_template('register.html'), 400

        # Validar contraseña
        if password != confirm_password:
            flash("Las contraseñas no coinciden.", "error")
            return render_template('register.html'), 400

        # Generar hash de la contraseña
        hashed_password = generate_password_hash(password)

        # Conectar a MySQL
        cur = mysql.connection.cursor()

        try:
            # Insertar usuario en la base de datos
            cur.execute("""
                INSERT INTO usuarios 
                (nombre, apellidos, email, telefono, direccion, password, recibir_promociones)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (nombre, apellidos, email, telefono, direccion, hashed_password, recibir_promociones))
            mysql.connection.commit()
        except Exception as e:
            mysql.connection.rollback()
            if "Duplicate entry" in str(e):
                flash("Este correo electrónico ya está registrado.", "error")
            else:
                flash("Error al registrar el usuario.", "error")
            cur.close()
            return render_template('register.html'), 400
        finally:
            cur.close()

        # Crear mensaje de correo
        msg = Message(
            subject="¡Bienvenido a Josesito Enterprise!",
            recipients=[email],
            body=f"""
            ¡Hola {nombre}!

            Gracias por registrarte en Josesito Enterprise.
            Estamos encantados de tenerte con nosotros.
            ¡Esperamos que disfrutes tu experiencia!

            Atentamente,
            El equipo de Josesito Enterprise
            """
        )

        # Adjuntar imagen (opcional)
        try:
            with app.open_resource("static/images/bienvenida.jpg") as fp:
                msg.attach("bienvenida.jpg", "image/jpeg", fp.read())
        except Exception as e:
            print("Error al adjuntar imagen:", str(e))

        # Enviar correo
        try:
            mail.send(msg)
            flash("Registro exitoso. Revisa tu correo.", "success")
            return redirect(url_for('exitoso')) # Cambia 'exitoso' por tu ruta de éxito
        except Exception as e:
            flash(f"Error al enviar el correo: {str(e)}", "warning")

    return render_template('register.html')

@app.route('/payment')
def payment_form():
    return render_template('payment.html')


# --- NUEVA RUTA PARA HORARIO ---


@app.route('/Horario_y_Ubicacion')
def horario():
    return render_template('Horario_y_Ubicacion.html')

# --- RUTAS DEL CRUD DE PAGOS (Mantenidas) ---
# ... (Tu código existente para /obtener_pagos, /payment POST, /eliminar_tarjeta, /actualizar_tarjeta)
# Lo omito aquí para no duplicar tu app.py, pero asegúrate de que esté en tu archivo real.
# --- CRUD de pagos (RUTAS MODIFICADAS) ---


@app.route('/obtener_pagos')
def obtener_pagos():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, metodo_pago, numero_tarjeta, fecha_expiracion, cvv FROM pagos")
    pagos_raw = cursor.fetchall()
    cursor.close()

    pagos_formateados = []
    for pago in pagos_raw:
        card_id = pago['id'] # Acceder como dict
        metodo_pago = pago['metodo_pago'] # Acceder como dict
        numero_completo = pago['numero_tarjeta'] # Acceder como dict
        fecha_expiracion = pago['fecha_expiracion'] # Acceder como dict
        cvv = pago['cvv'] # Acceder como dict

        ultimos_4_digitos = "XXXX"
        if numero_completo and len(numero_completo) >= 4:
            ultimos_4_digitos = numero_completo[-4:]
        
        # Aunque el cursor sea DictCursor, los valores devueltos por fetchall son diccionarios,
        # pero para el jsonify estás construyendo una lista de listas.
        # Si la plantilla que usa 'obtener_pagos' espera una lista de listas, esto está bien.
        # Si espera diccionarios, deberías devolver 'pagos_raw' directamente.
        pagos_formateados.append([
            card_id,
            metodo_pago,
            ultimos_4_digitos,
            fecha_expiracion,
            cvv
        ])
    
    return jsonify(pagos_formateados)

@app.route('/payment', methods=['POST'])
def guardar_pago():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM pagos")
    cantidad = cursor.fetchone()['COUNT(*)'] # Acceder como dict, o cursor.fetchone()[0] si no fuera DictCursor

    if cantidad >= 2:
        return jsonify({'error': 'Solo se permiten 2 tarjetas registradas'}), 400

    metodo = request.form['payment-method']
    numero_completo = request.form.get('card-number', '')
    expira = request.form.get('expiry-date', '')
    cvv = request.form.get('cvv', '')

    if not all([metodo, numero_completo, expira, cvv]):
        return jsonify({"error": "Faltan datos de la tarjeta para el registro."}), 400
    
    try:
        cursor.execute("INSERT INTO pagos (metodo_pago, numero_tarjeta, fecha_expiracion, cvv) VALUES (%s, %s, %s, %s)",
                       (metodo, numero_completo, expira, cvv))
        mysql.connection.commit()
        cursor.close()
        return jsonify({'message': 'Tarjeta registrada correctamente'})
    except Exception as e:
        mysql.connection.rollback()
        cursor.close()
        return jsonify({'error': f'Error al registrar tarjeta: {str(e)}'}), 500

@app.route('/eliminar_tarjeta/<int:card_id>', methods=['DELETE'])
def eliminar_tarjeta(card_id):
    cursor = mysql.connection.cursor()
    try:
        cursor.execute("DELETE FROM pagos WHERE id = %s", (card_id,))
        mysql.connection.commit()
        if cursor.rowcount == 0:
            return jsonify({'error': 'Tarjeta no encontrada para eliminar.'}), 404
        return jsonify({'message': 'Tarjeta eliminada correctamente'})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'error': f'Error al eliminar tarjeta: {str(e)}'}), 500
    finally:
        cursor.close()

@app.route('/actualizar_tarjeta/<int:card_id>', methods=['PUT'])
def actualizar_tarjeta(card_id):
    # Aquí es importante que los nombres de los request.form coincidan con cómo los envías desde tu JS de actualización
    metodo = request.form.get('metodo_pago') # Ajustado al nombre de columna/JS común
    numero_completo = request.form.get('numero_tarjeta') # Ajustado al nombre de columna/JS común
    expira = request.form.get('fecha_expiracion') # Ajustado al nombre de columna/JS común
    cvv = request.form.get('cvv') # Ajustado al nombre de columna/JS común

    if not all([metodo, numero_completo, expira, cvv]):
        return jsonify({"error": "Faltan datos para actualizar la tarjeta."}), 400
    
    cursor = mysql.connection.cursor()
    try:
        cursor.execute("""
            UPDATE pagos 
            SET metodo_pago=%s, numero_tarjeta=%s, fecha_expiracion=%s, cvv=%s 
            WHERE id=%s
        """, (metodo, numero_completo, expira, cvv, card_id))
        mysql.connection.commit()
        if cursor.rowcount == 0:
            return jsonify({'error': 'Tarjeta no encontrada para actualizar.'}), 404
        return jsonify({'message': 'Tarjeta actualizada correctamente'})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'error': f'Error al actualizar tarjeta: {str(e)}'}), 500
    finally:
        cursor.close()


# --- NUEVAS RUTAS PARA EL CRUD DE SERVICIOS REGISTRADOS ---

@app.route('/register_service', methods=['GET', 'POST'])
def register_service():
    if request.method == 'POST':
        # ¡CORRECCIÓN AQUÍ! Usar los nombres 'name' de los inputs HTML
        fecha_servicio = request.form['fecha_servicio'] # Cambiado de 'service-date'
        vehiculo = request.form['vehiculo']         # Cambiado de 'service-vehicle'
        descripcion = request.form.get('descripcion', '') # Cambiado de 'service-description'
        tipo_servicio = request.form.get('tipo_servicio', 'General') # Cambiado de 'service-type'

        try:
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO servicios_registrados (fecha_servicio, vehiculo, descripcion, tipo_servicio) VALUES (%s, %s, %s, %s)",
                        (fecha_servicio, vehiculo, descripcion, tipo_servicio))
            mysql.connection.commit()
            cur.close()
            flash('¡Servicio registrado exitosamente!', 'success')
            return redirect(url_for('register_service')) # Redirigir para evitar reenvío
        except Exception as e:
            flash(f'Error al registrar el servicio: {str(e)}', 'danger')
            mysql.connection.rollback()
            # No cierres el cursor aquí si hay un rollback, ya se cerrará en el finally o en el siguiente intento.
            # cur.close() # Si no se cierra aquí, asegúrate de que se cierre en un finally o se reabra correctamente.
        
    return render_template('register_service.html')

# --- Ruta Secreta para el Listado de Servicios Registrados (READ) ---
@app.route('/admin_servicios_registrados_secreto', methods=['GET'])
def listado_servicios_secreto():
    cur = mysql.connection.cursor()
    # Gracias a app.config['MYSQL_CURSORCLASS'] = 'DictCursor', fetchall() ya devuelve diccionarios
    cur.execute("SELECT id, fecha_servicio, vehiculo, descripcion, tipo_servicio, fecha_registro FROM servicios_registrados ORDER BY fecha_registro DESC")
    servicios = cur.fetchall() # Ahora 'servicios' contendrá una lista de diccionarios
    cur.close()
    return render_template('listado_servicios.html', servicios=servicios)

# --- Ruta para Editar Servicio (UPDATE) ---
@app.route('/editar_servicio/<int:id>', methods=['GET', 'POST'])
def editar_servicio(id):
    cur = mysql.connection.cursor()
    
    if request.method == 'POST':
        # ¡CORRECCIÓN AQUÍ! Usar los nombres 'name' de los inputs HTML del formulario de edición
        # Recuerda que en editar_servicio.html, se añadió un campo oculto para el ID
        id_servicio_form = request.form.get('id') # Obtener el ID del campo oculto del formulario
        fecha_servicio = request.form['fecha_servicio'] # Cambiado de 'service-date'
        vehiculo = request.form['vehiculo']         # Cambiado de 'service-vehicle'
        descripcion = request.form.get('descripcion', '') # Cambiado de 'service-description'
        tipo_servicio = request.form.get('tipo_servicio', 'General') # Cambiado de 'service-type'

        try:
            cur.execute("""
                UPDATE servicios_registrados
                SET fecha_servicio=%s, vehiculo=%s, descripcion=%s, tipo_servicio=%s
                WHERE id=%s
            """, (fecha_servicio, vehiculo, descripcion, tipo_servicio, id_servicio_form)) # Usar id_servicio_form
            mysql.connection.commit()
            flash('Servicio actualizado exitosamente!', 'success')
            return redirect(url_for('listado_servicios_secreto'))
        except Exception as e:
            flash(f'Error al actualizar el servicio: {str(e)}', 'danger')
            mysql.connection.rollback()
        finally:
            cur.close()
    
    # Si es GET, o si POST falló (y necesitas recargar el formulario con los datos existentes)
    cur = mysql.connection.cursor() # Reabrir cursor si se cerró en el try/except de POST
    cur.execute("SELECT id, fecha_servicio, vehiculo, descripcion, tipo_servicio, fecha_registro FROM servicios_registrados WHERE id = %s", (id,))
    servicio = cur.fetchone() # Obtiene un solo registro como diccionario gracias a 'DictCursor'
    cur.close()

    if not servicio:
        flash('Servicio no encontrado.', 'danger')
        return redirect(url_for('listado_servicios_secreto'))
    
    return render_template('editar_servicio.html', servicio=servicio)

# --- Ruta para Eliminar Servicio (DELETE) ---
@app.route('/eliminar_servicio/<int:id>', methods=['POST'])
def eliminar_servicio(id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM servicios_registrados WHERE id = %s", (id,))
        mysql.connection.commit()
        if cur.rowcount == 0:
            flash('Servicio no encontrado para eliminar.', 'danger')
        else:
            flash('Servicio eliminado exitosamente!', 'success')
    except Exception as e:
        flash(f'Error al eliminar el servicio: {str(e)}', 'danger')
        mysql.connection.rollback()
    finally:
        cur.close()
    return redirect(url_for('listado_servicios_secreto'))

# Ruta de Login (ejemplo)
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        cur = mysql.connection.cursor()
        try:
            cur.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
            usuario = cur.fetchone()
        finally:
            cur.close()

        if usuario and check_password_hash(usuario['password'], password):
            session['loggedin'] = True
            session['id'] = usuario['id']
            session['email'] = usuario['email']
            session['nombre'] = usuario['nombre']
            session['apellidos'] = usuario['apellidos']

            flash("Inicio de sesión exitoso", "success")
            return redirect(url_for('dashboard'))
        else:
            flash("Correo o contraseña incorrectos", "error")
            return render_template('login.html'), 401

    return render_template('login.html')

# Ejemplo de página protegida
@app.route('/dashboard')
def dashboard():
    if 'loggedin' in session:
        flash("Inicio de sesión exitoso", "success")
        return redirect(url_for('index'))
    else:
        flash("Debes iniciar sesión primero", "error")
        return redirect(url_for('login'))

@app.route('/perfil')
def perfil():
    if 'loggedin' in session:
        return render_template('perfil.html', usuario=session)
    return redirect(url_for('login'))

@app.route('/configuracion', methods=['GET', 'POST'])
def configuracion():
    if 'loggedin' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        # Obtener los datos del formulario
        nombre = request.form.get('nombre')
        apellidos = request.form.get('apellidos')
        telefono = request.form.get('telefono')
        direccion = request.form.get('direccion')

        # Guardar cambios en la base de datos
        cur = mysql.connection.cursor()
        try:
            cur.execute("""
                UPDATE usuarios 
                SET nombre = %s, apellidos = %s, telefono = %s, direccion = %s
                WHERE email = %s
            """, (nombre, apellidos, telefono, direccion, session['email']))
            mysql.connection.commit()
            flash("Datos actualizados correctamente", "success")
        except Exception as e:
            mysql.connection.rollback()
            flash(f"Error al guardar cambios: {str(e)}", "error")
        finally:
            cur.close()

        return redirect(url_for('perfil'))

    return render_template('configuracion.html')

@app.route('/notificaciones')
def notificaciones():
    if 'loggedin' in session:
        return render_template('notificaciones.html')
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.pop('loggedin', None)
    session.pop('id', None)
    session.pop('email', None)
    session.pop('nombre', None)
    session.pop('apellidos', None)

    flash("Has cerrado sesión correctamente", "success")
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)