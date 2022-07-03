
import connection


@connection.connection_handler
def add_users(cursor, username, password):
    query = '''
        insert into users(username,password)
        values (%(username)s,%(password)s)
    '''
    values = {'username':username,
              'password':password}

    cursor.execute(query, values)



@connection.connection_handler
def get_user(cursor, username):
    query = '''
        select * from
        users
        where username = %(username)s
    '''
    values = {
        'username': username
    }

    cursor.execute(query,values)
    return cursor.fetchone()



@connection.connection_handler
def get_pass(cursor, username):
    cursor.execute(
        "SELECT password FROM users "
        "WHERE username = %(username)s;",
        {"username": username}
    )
    return cursor.fetchone()['password']


@connection.connection_handler
def insert_vote(cursor,id,name,user_id):
    query = '''
        insert into planet_votes(planet_name,user_id,planet_id)
        values (%(name)s,%(user_id)s,%(id)s)
    '''
    values = {
        'id':id,
        'name':name,
        'user_id':user_id
    }
    cursor.execute(query,values)


@connection.connection_handler
def vote_planet_count(cursor):
    query = '''
        select planet_name,count(planet_name)
        from planet_votes
        group by planet_name
    '''
    cursor.execute(query)
    return cursor.fetchall()