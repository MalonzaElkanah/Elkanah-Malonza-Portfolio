# PORTFOLIO_API
Built with Django and Django-REST-Framework

## Table of Contents
  - [Features](#features)
    - [Implemented](#implemented)
    - [Todo](#todo)
  - [Live Demo](#live-demo)
  - [Installation guide](#installation-guide)
    - [Dependacies Installation](#dependacies-installation)
  - [Testing and Running Guide](#testing-and-running-guide)
  - [API Documentation](#api-documentation)
  - [Key Python Modules Used](#key-python-modules-used)
  - [Reference Resources](#reference-resources)


## Features
### Implemented

#### Auth
1. Generate token (Login), Revoke token by User

#### Projects
1. Create, List, Read, Update and Delete Project.
2. Create Project Tech-Stack
3. Create, Update Project Images Demo.

#### Blog
1. Create, List, Read, Update and Delete Article.
2. Article HTML Editor.
3. Create, Update Article Categories
4. Create, Update Article Series
5. Create, Delete Comments and Replies.

#### Profile
1. Create, List, Read, Update and Delete profile
  - Full Name,
  - Title,
  - Phone_number
  - Display Image,
  - Email,
  - Description,
  - Address
2. Create, Update Resume/CV file
3. Create, Update Social Links with their icons

#### Contact-Me
1. Send/Create Messages

#### Skills
1. Create, List, Read, Update and Delete Technical Skills
2. Create, List, Read, Update and Delete Professional Skills

#### Service
1. Create, List, Read, Update and Delete Service
  - Name
  - Description

#### Education
1. Create, List, Read, Update and Delete Education
  - institution,
  - location,
  - study_area,
  - study_type,
  - start_date,
  - end_date,
  - gpa,
  - description

#### Work
1. Create, List, Read, Update and Delete Work
  - company,
  - location,
  - position,
  - website,
  - start_date,
  - end_date
2. Create, List, Read, Update and Delete Work Highlights

#### Pricing
1. Create, List, Read, Update and Delete Pricing


### Todo
#### General
- Document apis with Postman
- Frontend with Angular
- Create and Send Notifications (Calery)
- Write tests
- Log Users/Device IP Address - Traffic
- Admin-Email Management
- Back-Up DB
- Separete Settings.py (Production, Development, Testing)
- 500 / 404 Error Display
- Hire Me feature
- Change id field to UUIDField

#### Auth
- JWT Authentication

#### Project
- Video Demo (Youtube)
- Image Demo
- Github Api
- Description MarkDown Editor
- Project-List Serializer should be minimal
- Project archive list

#### Blog
- Clicks and Article views
- Article Read time
- Article archive list

#### Contact-Me
- Email Notification of new Messages

## Live Demo
The projected is hosted at:
  - **BACKEND:** https://elkanahmalonza.pythonanywhere.com/api/v1/
  - **FRONTEND:** https://elkanahmalonza.netlify.app/


## Installation Guide

### Dependacies Installation

- Installing the application locally requires
    1. [Python 3.7+](https://www.python.org/downloads/release/python-393/) - download and install it.
    2. [virtualenv](https://docs.python-guide.org/dev/virtualenvs/) - To create a virtual environment and activate it, run the following commands.
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
- The project contains a `.env.sample` file at its root with the environment variables required to run the app. Copy the file and name it `.env`, populating it with the correct values.
  __NOTE:__ The 'SECRET_KEY' environment variables is a long random bytes or str.

- Install the project dependacies from requirements.txt by running the following command in shell:
```bash
pip install -r requirements.txt
```

## Testing and Running Guide
1. To activate the development server run:
```bash
python manage.py runserver
```
At this point, the development server should be accessible at _http://127.0.0.1:8000/api/v1/_

2. Testing - To run all the tests:

```bash
python manage.py test
```


## API Documentation
- **DRF Docs:** [http://127.0.0.1:8000/api/v1/](http://127.0.0.1:8000/api/v1/)
- **OpenAPI Specification Docs:** [http://127.0.0.1:8000/?format=openapi-json](http://127.0.0.1:8000/?format=openapi-json)

## Key Python Modules Used
- **Django(4.2.5):** Django is a back-end server side web framework. Django is free, open source and written in Python. Django makes it easier to build web pages using Python.
- **Django Rest Framework:** Django Rest Framework (DRF) is a package built on the top of Django to create web APIs. DRF allows us to represent their functionality Django application in the form of REST APIs.
- **flake8** - static analysis tool

## Reference Resources
- [virtualenv](https://docs.python-guide.org/dev/virtualenvs/)
- [Django(4.2.3)](https://docs.djangoproject.com/en/4.2/intro/overview/)
- [Django Rest Framework](https://www.django-rest-framework.org/)



```
class HasIDMixin(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
        name='id'
    )
```
