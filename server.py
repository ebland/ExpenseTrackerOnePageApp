import react
import os
import json
import datetime
from flask_debugtoolbar import DebugToolbarExtension
from jinja2 import StrictUndefined
from flask import Flask, jsonify, render_template, request, flash, redirect, url_for, session
from model import connect_to_db, db, Expense, User, Role_ID


app = Flask(__name__)

app.secret_key = "ABC"

#@app.errorhandler(404)
#def page_not_found(error):

    #return render_template('page_not_found.html'), 404


@app.route('/homepage')
def index():
    """Homepage."""

    return render_template("homepage.html")


# @app.route('/search')
# def search(): 
#    """"Search Site with Keyword in SideBar."""

#     return render_template('search_result_form.html')


@app.route('/search_process', methods=['POST'])
def search_process():
    #return 'a search'
     # 1. set email and password from form 
    fname = request.form.get('fname')
    lname = request.form.get('lname')

    try:
        users = User.query.filter_by(fname=fname).first()
        first_name = users.fname
        last_name = users.lname
    except:
        return "User not found!!! "
        flash("User not found!!!")
        return render_template('login_form.html')
     
    return render_template("/", first_name=first_name, last_name=last_name )


@app.route('/login')
def login():
    """Logs in a user"""

    return render_template('login_form.html')
 

@app.route('/login_process', methods=['POST'])
def login_process():
    """Logs in a user"""
    
    email = request.form.get('email')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first()
    if not user:  
    
        flash('User not found!')
        return render_template("homepage.html")
    elif email == str(user.email):
     
        session['user_id'] = user.user_id
        session['role_ids'] = []

    for role in user.roles:
        session['role_ids'].append(role.role_id)
    flash('User: {} has been logged in!'.format(email) )

    if  3 in session['role_ids']:
        user = User.query.filter_by(email=email).first()
        expenses = Expense.query.filter_by(user_id=user.user_id).all()  
        return render_template('homepage.html', current_user=user, expenses=expenses)      
    
    if  1 in session['role_ids']:
        user = User.query.filter_by(email=email).first()
        expenses = Expense.query.filter_by(user_id=user.user_id).all()
        users = User.query.filter_by(email=email).all()
        expense_id= Expense.query.count()
        expense_per_user_count = expenses.query.filter(expense.user_id == user.user_id).count()
        usercount = User.query.count()
        expensecount = Expense.query.count()

        return render_template('homepage.html', current_user=user, 
                               usercount=usercount, expenses=expenses,
                               expensecount=expensecount,
                               expense_per_user_count=expense_per_user_count)

    if  2 in session['role_ids']:
        user = User.query.filter_by(email=email).first()
        expenses = Expense.query.filter_by(user_id=user.user_id).all()
        return render_template('homepage.html', current_user=user)       
    
    return render_template('login_form.html')


@app.route('/logout')
def logout():
    """Logs a user out"""

    if (session['user_id'] != None):
        if session['user_id'] == True:
            del session['user_id']
            flash('User has been logged out')
            return render_template('homepage.html')
    else:
        return render_template('homepage.html')


@app.route('/delete_user')
def delete_user():
    """Deletes a user"""
    return render_template('delete_user_form.html')


@app.route('/show_user/<int:user_id>')
def show_user(user_id):
    """Shows Detailed information of Chosen User"""

    user = User.query.filter_by(user_id=user_id).first()

    return render_template('show_user.html', user=user)


@app.route('/users/<int:user_id>')
def user_detail(user_id):
    """Show User Information"""
   
    user = User.query.filter_by(user_id=user_id).first()
    
    return render_template('customer_profile.html', user=user)


@app.route('/all_users')
def user_list():
    """Show List of All Users active in Expense Tracker App."""
    
    users = User.query.all()

    return render_template("all_users.html", users=users)


@app.route('/create_new_user')
def create_new_user():
    """Creates a new user"""

    return render_template('create_new_user.html')
 

@app.route('/create_new_user_process', methods=["GET", "POST"])
def new_user():

    page = 'create_new_user'

    print(request.args.get('email'))
    if request.method == "POST":
        fname = request.form.get('fname')
        lname = request.form.get('lname')
        zip_code = request.form.get('zipcode')
        email = request.form.get('email')
        created_date = datetime.datetime.now()
        password = request.form.get('password')
        phone = request.form.get('phone')
        address1 = request.form.get('address1')
        address2= request.form.get('address2')
        city = request.form.get('city')
        state = request.form.get('state')
  
        user = User(fname=fname, lname=lname, zip_code=zip_code, email=email, created_date=created_date, password=password, phone=phone, address1=address1, address2=address2, city=city, state=state)

        db.session.add(user)
   
        db.session.commit()
  
        flash("User was addded successfully!!!")
        
        return redirect('/homepage')

    else:
        return render_template('create_new_user.html')


@app.route('/update_user',  methods=[ "POST"])
def update_user():

    user_id = request.form.get('user_id')
    email = request.form.get('email')
    fname = request.form.get('fname')
    lname = request.form.get('lname')
    #return user_lname
    
    #get user you clicked on and passed user_id in URL
    user = User.query.filter(user_id == user_id,email == email, fname==fname, lname==lname  ).first()


    return render_template('update_user.html', user=user)


@app.route('/update_user_process', methods=['POST'])
def update_user_process():
    """Update Existing User."""

    page = 'update_user_process'

    if request.method == "POST":
        user_id = request.form.get('user_id')
        fname = request.form.get('fname')
        lname = request.form.get('lname')
        zip_code = request.form.get('zipcode')
        email = request.form.get('email')
        created_date = datetime.datetime.now()
        password = request.form.get('password')
        phone = request.form.get('phone')
        address1 = request.form.get('address1')
        address2= request.form.get('address2')
        city = request.form.get('city')
        state = request.form.get('state')

        #get user you clicked on and passed user_id in URL
        user = User.query.filter(user_id == user_id,email == email ).first()

        #reset found user record with form posted values
        user.fname=fname
        user.lname=lname
        user.zip_code=zip_code
        user.email=email
        user.created_at=created_date
        user.password=password
        user.phone=phone
        user.address1=address1
        user.address2=address2
        user.city=city
        user.state=state
        # update db record
        db.session.add(user)
        db.session.commit()

        flash("User was updated successfully!!!")
        user = User.query.filter(user_id == user_id,email == email )
        users = User.query.all()

        return render_template("all_users.html", users=users)

@app.route('/all_users')
def all_users():
    """Show List of All users in Expense App."""

    users = User.query.all()

    return render_template("all_users.html", users=users)

@app.route('/all_expenses')
def expense_list():
    """Show List of All expenses in ECRM."""
    
    expenses = expense.query.all()

    return render_template("all_expenses.html", expenses=expenses)


@app.route('/all_expense_table')
def expense_table():
    """Show List of All expenses in ECRM."""
    
    expenses = expense.query.all()

    return render_template("all_expense_table.html", expenses=expenses)


@app.route('/expenses/<int:expense_id>')
def expense_detail(expense_id):
    """Show expense Information"""
   
    expense = expense.query.filter_by(expense_id=expense_id).first()

    return render_template('expense_detail.html', expense=expense)   


@app.route('/expense_form')
def expense_form():
    """Create expense"""
    
    roles = Role_ID.query.all()
    users = User.query.all()

    staff_list =[]
    customer_list = []

    for user in users:
        if Role_ID.query.get(2) in user.roles:
            staff_list.append(user)
        if Role_ID.query.get(3) in user.roles:
            customer_list.append(user)    

    return render_template('expense_form.html', roles=roles, staff_list=staff_list,
                           customer_list=customer_list)  


@app.route('/expense_update_process', methods=['POST'])
def update_expense():

    expense_id = request.form.get('expense_id')
    name = request.form.get('name')
    #return str(name)
 
    if expense_id is not None:
        expense_id = int(expense_id)
    
    expense = expense.query.filter(expense_id==expense_id).first()
    #return str(expense.expense_id)
    #reset record to form expense name
    expense.name = str(name)

     
    # update db record
    db.session.add(expense)
    db.session.commit()

    expenses = expense.query.all()

    return render_template("all_expenses.html", expenses=expenses)



@app.route('/expense_delete/<int:expense_id>', methods=["GET"])
def expense_delete(expense_id):

    # expense_to_delete = 0
    # expense_to_delete = request.form.get('expense_id')
    # if expense_to_delete is not None and code.isnumeric():
    #     expense_t_delete = int(expense_to_delete)

    #invoice = Invoice.query.filter(Invoice_number==invoice_id).first()
    expense = expense.query.filter_by(expense_id=expense_id).first()  #expense_id==invoice_id
    #return str(expense.expense_id)

    #session.query(MenuItem).filter_by(id=menu_id)
    db.session.delete(expense)
    db.session.commit()

    #flash(gettext(u"Delete Succesfully!"))

    expenses = expense.query.filter().all()   

    return render_template("all_expenses.html", expenses=expenses)


@app.route('/create_expense_process', methods=['POST'])
def create_new_expense(expense_id):
    """Create New expense."""

    expense_id = request.form.get('expense_id')
    name = request.form.get('name')
    description = request.form.get('description')
    user_id = request.form.get('user_id')
    customer_id = request.form.get('customer_id')
    expense_location = request.form.get('expense_location')
    total = request.form.get('total')

    expense = expense(expense_id=expense_id, name=name, description=description, 
                      user_id=user_id, customer_id =customer_id, 
                      expense_location=expense_location, total=total)

    db.session.add(expense)
    db.session.commit()

    flash("Expense added successfully!!!")
        
    return redirect('/all_expenses')


# @app.route('/create_expense_process', methods=['POST'])
# def create_new_expense(expense_id):
#     """Create New Expense."""

#     expense_id = request.form.get('expense')
#     expense_name = request.form.get('expense_name')
#     description = request.form.get('description')
#     user_id = request.form.get('user_id')
#     amount  = request.form.get('amount')
#     expense_location = request.form.get('expense_location')
#     expense_time = request.form.get('created_at')

#     expense = expenses(expense_id=expense, expense_name=expense_name, description=description, 
#                       user_id=user_id, amount=amount, 
#                       expense_location=expense_location, expense_time=create_at)

#     db.session.add(expense)
#     db.session.commit()

#     flash("Expense added successfully!!!")
        
#     return redirect('/expense_form')

# @app.route('/all_expenses')
# def expense_list():
#     """Show List of All expenses."""
    
#     expenses = Expense.query.all()

#     return render_template("all_expenses.html", expense_id=expense_id)


# @app.route('/all_expense_table')
# def expense_table():
#     """Show List of All expenses."""
    
#     expenses = Expense.query.all()

#     return render_template("all_expense_table.html", expenses=expenses)


# @app.route('/expenses/<int:expense_id>')
# def expense_detail(expense_id):
#     """Show expense Information"""
   
#     expense = Expense.query.filter_by(expense_id=expense_id).first()

#     return render_template('expense_detail.html', expense=expense)   


# @app.route('/expense_form')
# def expense_form():
#     """Create Expense"""
    
#     roles = Role_ID.query.all()
#     users = User.query.all()

#     user_list =[]
#     expense_list = []

#     for user in users:
#         if Role_ID.query.get(2) in user.roles:
#             admin_list.append(user)
#         if Role_ID.query.get(3) in user.roles:
#             users_list.append(user)    

#     return render_template('expense_form.html', roles=roles, user_list=user_list,
#                            expense_list=expense_list)  


# @app.route('/expense_update_process', methods=['POST'])
# def update_expense():

#     for user in users:
#         if Role_ID.query.get(2) in user.roles:
#             admin_list.append(user)
#         if Role_ID.query.get(3) in user.roles:
#             users_list.append(user)    

#     expense_id = request.form.get('expense_id')
#     name = request.form.get('name')
#     #return str(name)
 
#     if expense_id is not None:
#         expense_id = int(expense_id)
    
#     expense = Expense.query.filter(expense_id==expense_id).first()
#     #return str(expense.expense_id)
#     #reset record to form expense name
#     expense.name = str(name)

     
#     # update db record
#     db.session.add(expense)
#     db.session.commit()

#     expenses = Expense.query.all()

#     return render_template("all_expenses.html", expenses=expenses)



# @app.route('/expense_delete/<int:expense_id>', methods=["GET"])
# def expense_delete(expense_id):

#     expense = Expense.query.filter_by(expense_id=expense_id).first() 

#     db.session.delete(expense)
#     db.session.commit()

#     #flash(gettext(u"Delete Succesfully!"))

#     expenses = Expense.query.filter().all()   

#     return render_template("all_expenses.html", expenses=expenses)


@app.route('/upload', methods=['POST'])
def upload():
    f = request.files['data_file'].read().decode('utf-8')

    - debugging
    file_contents = codecs.open(file_contents, "r", encoding='utf-8', errors='ignore')
    f = codecs.open(request.files['data_file'], "r", encoding='utf-8', errors='ignore')
    f = codecs.decode(request.files['data_file'], 'utf-8', 'ignore')
    if not f:
        flash("Error. File upload attempt detected, but no file found. Please contact the application administrator.",
              'danger')

    # To do: Get the conditional below to work, and remove the placeholder 'if True'.
    # if type(f) == '.csv':
    if True:
        f = csv2json_conversion(f)
        import_data = Import_Data(f)
        data_context = request.form['form_submit']
        valid_schema = validate_columns(import_data, data_context)
        if valid_schema == True:
            validated_data = validate_import(current_user, import_data, data_context)
            if validated_data:
                add_to_db(validated_data, data_context)
    else:
        flash('Error. Incorrect file type. The only file types accepted are: .csv', 'danger')

    return redirect(request.referrer)

if __name__ == "__main__":
    app.debug = True
    app.jinja_env.auto_reload = app.debug  
    connect_to_db(app)
    DebugToolbarExtension(app)
    app.run(port=5001, host='0.0.0.0')