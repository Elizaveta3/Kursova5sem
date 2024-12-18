import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import {RegisterPage} from './pages/registerPage'
import EnterPage from './pages/enterPage'
import {CoursesTeacherPage} from './pages/coursesTeacher'
import { CoursesStudentPage } from './pages/coursesStudent'
import { TasksTeacher } from './pages/tasksTeacher.jsx'
import { TaskTeacher } from './pages/taskTeacher.jsx'
import { TaskStudent } from './pages/TaskStudent.jsx'
import '../src/styles/reset.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<EnterPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/enter" element={<EnterPage />} />
      <Route path="/coursesTeacher" element={<CoursesTeacherPage />} />
      <Route path='/coursesStudent' element={<CoursesStudentPage/>} />
      <Route path='/tasksTeacher' element={<TasksTeacher/>}/>
      <Route path='/taskTeacher' element={<TaskTeacher/>}/>
      <Route path='/taskStudent' element={<TaskStudent/>} />
    </Routes>
    </>
  )
}

export default App
