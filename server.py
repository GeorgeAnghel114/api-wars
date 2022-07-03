from flask import Flask, render_template,request,url_for,redirect,session,jsonify
import data_manager, util
import ast
import os
import psycopg2

connection_string = os.environe.get('DataBase/planet_votes.sql')
connection = psycopg2.connect(connection_string)



app = Flask(__name__)


app.secret_key = "_5#y2LF4Q8z\xec]/"



@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/register', methods=['POST','GET'])
def register():
    message = ''
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        username = request.form.get('username')
        password = request.form.get('password')
        user_cred = data_manager.get_user(username)
        if not username or not password:
            message = 'Please, fill in both fields.'
        elif user_cred:
            message = 'Username already exists, please choose another one!'
        else:
            password = util.hash_password(password)
            data_manager.add_users(username,password)
            return redirect(url_for('hello_world'))
    elif request.method == 'POST':
        message = 'FIll THE FORM'
    return render_template('register.html', message=message)


@app.route('/login', methods=['GET', 'POST'])
def login():
    message = ''
    if request.method == 'POST' and (not request.form['username'] or not request.form['password']):
        message = 'Please, fill in both fields.'
        return render_template('login.html', message=message)
    elif request.method == 'POST' \
            and 'username' in request.form \
            and 'password' in request.form \
            and util.verify_password(request.form['password'],
                                          data_manager.get_pass(request.form['username'])):
        user_details = data_manager.get_user(request.form['username'])
        if user_details:
            session['logged_in'] = True
            session['id'] = user_details['id']
            session['username'] = user_details['username']
            return redirect(url_for('hello_world'))
        else:
            message = 'Wrong username or password.'
    return render_template('login.html', message=message)


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('hello_world'))


@app.route('/vote',methods=['GET', 'POST'])
def vote_planet():
    data = ast.literal_eval(request.data.decode("utf-8"))
    data_manager.insert_vote(int(data.get('id')),data.get('name'),int(session['id']))

    return jsonify(added=True)


@app.route('/api/statistics')
def get_statistics():
    planets_counts = data_manager.vote_planet_count()

    return jsonify(planets_counts)


if __name__ == '__main__':
    app.run(debug=True,
            port=8000)
