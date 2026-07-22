# บันทึกการเรียน: เริ่มโปรเจกต์ Django + React

วันที่: 21 กรกฎาคม 2026  
โปรเจกต์: ATSlots

## เป้าหมาย

สร้างเว็บที่แยกส่วนหน้าจอ (React) และส่วน API (Django) ออกจากกัน โดยให้ React เรียกข้อมูล JSON จาก Django ได้

ภาพรวมของระบบ:

```text
ผู้ใช้เปิดเว็บ React
        |
        | fetch() ขอข้อมูล
        v
Django REST API
        |
        | ส่งข้อมูล JSON กลับ
        v
React แสดงข้อมูลบนหน้าจอ
```

## โครงสร้างโปรเจกต์

```text
atslots/
|- .venv/       # Python virtual environment
|- backend/     # Django backend และ API
|  |- api/      # Django app สำหรับ API
|  |- config/   # Django project settings และ URLs
|  |- manage.py
|- frontend/    # React application (Vite)
|- README.md
```

## 1. สร้างและใช้งาน Virtual Environment

Virtual environment คือพื้นที่ติดตั้ง Python packages แยกสำหรับโปรเจกต์นี้ เช่น Django และ Django REST framework ช่วยไม่ให้ package ของหลายโปรเจกต์ปะปนกัน

คำสั่งที่โฟลเดอร์หลัก `atslots`:

```cmd
python -m venv .venv
```

เปิดใช้งาน environment ใน Windows CMD:

```cmd
.venv\Scripts\activate.bat
```

หากสำเร็จ command prompt จะขึ้นต้นด้วย `(.venv)`:

```text
(.venv) D:\Personal Projects\atslots>
```

ออกจาก environment:

```cmd
deactivate
```

> เมื่อ activate แล้ว ให้ใช้ `python` เป็นหลัก เช่น `python manage.py runserver` ไม่ควรใช้ `py` เพราะ `py` อาจเลือก Python นอก virtual environment ได้

## 2. ติดตั้ง Packages สำหรับ Backend

ในขณะที่ `(.venv)` ทำงานอยู่:

```cmd
python -m pip install django djangorestframework django-cors-headers
```

ความหมายของแต่ละ package:

| Package | หน้าที่ |
| --- | --- |
| `django` | Framework ฝั่ง backend |
| `djangorestframework` | สร้าง REST API และส่ง/รับ JSON ได้สะดวก |
| `django-cors-headers` | อนุญาต React ที่คนละ port เรียก Django API ได้ |

## 3. สร้าง Django Backend

จากโฟลเดอร์หลัก:

```cmd
django-admin startproject config backend
```

ผลลัพธ์สำคัญคือ `backend/manage.py` ซึ่งเป็นคำสั่งหลักของ Django

เข้าสู่ backend แล้วสร้างตารางพื้นฐานของ Django:

```cmd
cd backend
python manage.py migrate
```

คำสั่ง `migrate` จะสร้างฐานข้อมูล SQLite ที่ `backend/db.sqlite3` และตารางพื้นฐาน เช่น users, sessions และ admin

## 4. รันและหยุด Django Development Server

ขณะอยู่ใน `backend`:

```cmd
python manage.py runserver
```

Django จะรันที่:

```text
http://127.0.0.1:8000/
```

หยุด server โดยกด:

```text
Ctrl + C
```

หากเปิด `http://127.0.0.1:8000/` แล้วเจอ 404 ถือว่าปกติในตอนนี้ เพราะยังไม่ได้สร้าง route สำหรับหน้า `/` โดยมีเฉพาะ `/admin/` และ `/api/`

## 5. สร้าง React Frontend

เปิด CMD อีกหน้าต่างหนึ่ง แล้วกลับไปโฟลเดอร์หลักของโปรเจกต์:

```cmd
cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm run dev
```

Vite จะให้ URL ของ frontend โดยปกติคือ:

```text
http://localhost:5173/
```

> ขณะพัฒนา ให้ Django และ React ทำงานคนละ CMD window เพราะเป็นคนละ server

## 6. สร้าง Django App สำหรับ API

กลับเข้า backend:

```cmd
cd ..\backend
python manage.py startapp api
```

`api` คือ Django app ที่รวบรวม models, views และ URLs เกี่ยวกับ API ของระบบ ATSlots

## 7. ตั้งค่า Django

แก้ไฟล์ `backend/config/settings.py`

### เพิ่ม applications

เพิ่ม `corsheaders`, `rest_framework` และ `api` ใน `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'api',
]
```

### เพิ่ม CORS middleware

วาง `CorsMiddleware` ก่อน `CommonMiddleware`:

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

### อนุญาต React เรียก API

เพิ่มท้ายไฟล์:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
]
```

การตั้งค่านี้หมายความว่า Django ยอมรับ request จาก React development server ที่ port 5173 ได้

### Default primary key

บรรทัดนี้ต้องอยู่นอก `DATABASES`:

```python
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
```

ตรวจสอบการตั้งค่าทั้งหมดได้ด้วย:

```cmd
python manage.py check
```

หากทุกอย่างถูกต้อง จะเห็น:

```text
System check identified no issues (0 silenced).
```

## 8. สร้าง API Endpoint แรก

สร้าง view ที่ `backend/api/views.py`:

```python
from rest_framework.views import APIView
from rest_framework.response import Response


class APIRootView(APIView):
    def get(self, request):
        return Response({
            'message': 'Welcome to the API root!'
        })
```

สร้างไฟล์ `backend/api/urls.py`:

```python
from django.urls import path
from .views import APIRootView

urlpatterns = [
    path('', APIRootView.as_view(), name='api-root'),
]
```

เชื่อม URL ของ app ใน `backend/config/urls.py`:

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
```

เมื่อรัน Django server แล้ว เปิด:

```text
http://127.0.0.1:8000/api/
```

ผลลัพธ์ที่ถูกต้อง:

```json
{
  "message": "Welcome to the API root!"
}
```

`HTTP 200 OK` หมายความว่า request สำเร็จ ส่วน `405 Method Not Allowed` มักหมายถึง view ไม่ได้รองรับ method ที่ส่งมา เช่น GET หรือ URL ผูกกับ class ผิดตัว

## 9. ให้ React เรียก Django API

แก้ไฟล์ `frontend/src/App.jsx`:

```jsx
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('กำลังโหลด...')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('เรียก API ไม่สำเร็จ')
        }
        return response.json()
      })
      .then((data) => {
        setMessage(data.message)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [])

  return (
    <main>
      <h1>ATSlots</h1>
      {error ? <p>เกิดข้อผิดพลาด: {error}</p> : <p>{message}</p>}
    </main>
  )
}

export default App
```

ความหมายโดยย่อ:

| ส่วน | หน้าที่ |
| --- | --- |
| `useState` | เก็บข้อความและ error สำหรับแสดงผล |
| `useEffect` | เรียก API หนึ่งครั้งตอนเปิดหน้า |
| `fetch(...)` | ส่ง HTTP GET request ไป Django |
| `response.json()` | แปลง JSON response เป็น JavaScript object |
| `setMessage(data.message)` | นำค่า `message` มาเก็บเพื่อแสดงบนหน้า |

เมื่อเปิด `http://localhost:5173/` React จะแสดงข้อความที่ได้รับจาก Django:

```text
Welcome to the API root!
```

## ปัญหาที่พบและสิ่งที่เรียนรู้

| อาการ | สาเหตุ | วิธีแก้ |
| --- | --- | --- |
| `can't open file manage.py` | รันคำสั่งที่โฟลเดอร์ `atslots` แทน `backend` | ใช้ `cd backend` ก่อน หรือ `python backend\manage.py ...` |
| `ModuleNotFoundError: corsheaders` | ยังไม่ได้ติดตั้ง package ใน `.venv` | `python -m pip install django-cors-headers` |
| `NameError: include` | ลืม import `include` ใน `config/urls.py` | `from django.urls import include, path` |
| `ImportError: cannot import name api_root` | ชื่อใน `urls.py` ไม่ตรงกับ view | import class/function ชื่อที่ถูกต้อง |
| `405 Method Not Allowed` | URL ชี้ไปที่ `APIView` พื้นฐานที่ไม่มี `get()` | ชี้ไปที่ `APIRootView.as_view()` |
| CORS error ใน browser | Django ไม่อนุญาต origin ของ React | เพิ่ม `corsheaders` และ `CORS_ALLOWED_ORIGINS` |
| หน้า `/` ขึ้น 404 | ยังไม่ได้กำหนด URL route สำหรับ root | เปิด `/api/` หรือสร้าง root route ภายหลัง |

## ขั้นต่อไปของ ATSlots

สำหรับระบบจองช่วงเวลา สามารถพัฒนาต่อเป็นลำดับดังนี้:

1. ออกแบบ models เช่น `Slot`, `Booking` และ user
2. สร้าง migrations และบันทึกข้อมูลลง SQLite
3. สร้าง API สำหรับดูรายการ slot, สร้างการจอง และยกเลิกการจอง
4. สร้างหน้า React สำหรับแสดงเวลาและฟอร์มจอง
5. เพิ่มระบบ login และกำหนดสิทธิ์ผู้ใช้
6. เปลี่ยนฐานข้อมูลเป็น PostgreSQL และตั้งค่า production ก่อน deploy

## คำสั่งที่ใช้บ่อย

```cmd
:: เปิด virtual environment (ที่โฟลเดอร์ atslots)
.venv\Scripts\activate.bat

:: เข้า backend
cd backend

:: ตรวจ Django settings
python manage.py check

:: สร้าง/อัปเดตตารางฐานข้อมูล
python manage.py migrate

:: รัน Django
python manage.py runserver

:: หยุด server
Ctrl + C

:: เข้า frontend จาก backend
cd ..\frontend

:: รัน React
npm run dev
```

#note
:: supabase
ลองเก็บข้อมูลแบบ JSON

:: next.JS