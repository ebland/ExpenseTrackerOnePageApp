import datetime
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship, backref
from flask_debugtoolbar import DebugToolbarExtension
from flask import Flask
db = SQLAlchemy()


class Role_ID(db.Model):
    """Role ID table."""

    __tablename__="roles"

    role_id = db.Column(db.Integer, 
                      primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    

class User_Roles(db.Model):

    __tablename__="user_roles"

    user_role_id = db.Column(db.Integer, 
                      primary_key=True,
                      unique=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.user_id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer(), db.ForeignKey('roles.role_id', ondelete='CASCADE'))


class User(db.Model):

    __tablename__="users"

    user_id = db.Column(db.Integer(), autoincrement=True, primary_key=True, unique=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.String(2), nullable=True)
    # Information
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(30), nullable=True)
    # Address
    address1 = db.Column(db.String(255), nullable=True)
    address2 = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(20), nullable=True)
    zip_code = db.Column(db.String(10), nullable=True)
    module_abbreviation =db.Column(db.String(4), nullable=True)
    active = db.Column(db.Boolean())
    # STATUS 
    created_at = db.Column(db.DateTime())
    modified = db.Column(db.DateTime())
    
    roles = db.relationship('Role_ID', secondary='user_roles',
                            backref=db.backref('users', lazy='dynamic'))
   
    def __repr__(self):
        return '<User user_id=%d, email=%s>' % (self.user_id, self.email)


class Expense(db.Model):
    """Expenses Table."""

    __tablename__ = 'expenses'
   
    expense_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    expense_name = db.Column(db.String(), nullable=True)
    # category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    # expense_userid = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    expense_location = db.Column(db.String(100))
    description = db.Column(db.String(255))
    module_abbreviation =db.Column(db.String(4), nullable=True)
    expense_time = db.Column(db.Integer,nullable=False)
    amount = db.Column(db.FLOAT,nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    # Status
    created_at = db.Column(db.DateTime())
    modified = db.Column(db.DateTime())

    user = db.relationship("User", backref=db.backref('expenses'))

    # category = db.relationship("Category", backref=db.backref('expenses'))

    # @classmethod
    # def get_user_expenses(cls):
    #     return cls.query.filter(Expense.user_id == current_user.id).all()

    # @classmethod
    # def get_week_expenses(cls,start,end):
    #     return cls.query.filter(expenses.user_id == current_user.id).\
    #                         filter(expenses.expense_time >= start).\
    #                         filter(expenses.expense_time <= end).\
    #                         order_by(expenses.created_time)\
    #                         .all()

 
# ---------------------
def seed_data():

    role_1=Role_ID(name='admin', description='master')
    role_2=Role_ID(name='user', description='user')
   

    db.session.add_all([role_1, role_2])
    db.session.commit()

    user1=User(fname='ninja', lname="Leslie", password='1234', email='her@her.com')
    user2=User(fname='bland', lname="Ninja", password='1234', email='me@her.com')
    user3=User(fname='test', lname="tester", password='1234', email='test@her.com')

    db.session.add_all([user1, user2, user3])
    db.session.commit()

    user_roles_admin=User_Roles(user_id=user1.user_id, role_id=role_1.role_id)
    user_roles_user=User_Roles(user_id=user2.user_id, role_id=role_2.role_id)

    db.session.add_all([user_roles_admin, user_roles_user])
    db.session.commit()

    expense_1=expense(name='expense1', user_id=user2.user_id, status="new")
    expense_2=expense(name='big expense', user_id=user2.user_id, status="reconciled")
    expense_3=expense(name='small expense', user_id=user2.user_id, status="pending")
    expense_4=expense(name='bigger expense', user_id=user2.user_id, status="need_receipt")
    expense_5=expense(name='biggest expense', user_id=user2.user_id, status="file_uploaded")
    expense_6=expense(name='smallest expense', user_id=user2.user_id, status="added_to_report")

    db.session.add_all([expense_1, expense_2, expense_3, expense_4, expense_5, expense_6])
    db.session.commit()

def connect_to_db(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///ecrm'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    db.app = app
    db.init_app(app)


    if __name__=="__main__":

    # app.debug = True
        app.jinja_env.auto_reload = app.debug  
        connect_to_db(app)
        DebugToolbarExtension(app)
        app.run(port=5001, host='0.0.0.0')