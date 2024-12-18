import React, { useState, useEffect } from "react";
import { Header } from "../components/Header/Header";
import TableGrades from "../components/TableGrades/TableGrades";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { PieChart } from '@mui/x-charts/PieChart';
import { setSelectedTask } from '../slices/taskSlice';
import "../styles/taskTeacher.css";
import "../styles/reset.css";

export const TaskTeacher = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedCourse = useSelector((state) => state.course.selectedCourse);
    const [tasks, setTasks] = useState([]); // Стан для завдань
    const [rows, setRows] = useState([]); // Стан для рядків таблиці

    useEffect(() => {
        if (selectedCourse) {
            // Запит для отримання завдань
            fetch(`/api/users/getTasks/${selectedCourse._id}`)
                .then((response) => response.json())
                .then((data) => {
                    setTasks(data.tasks);

                    if (data.tasks.length > 0) {
                        const firstTaskId = data.tasks[0]._id; // Перше завдання
                        fetchGrades(firstTaskId);
                    }
                })
                .catch((error) => console.error("Error fetching tasks:", error));
        }
    }, [selectedCourse]);

    const fetchGrades = (taskId) => {
        // Запит для отримання оцінок
        fetch(`/api/users/tasks/${taskId}/grades`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch grades");
                return response.json();
            })
            .then((data) => {
                if (data.grades) {
                    const formattedRows = data.grades.map((grade) => ({
                        studentName: grade.studentId?.name || "Невідомо",
                        grade: grade.grade || "Немає оцінки",
                    }));
                    setRows(formattedRows);
                } else {
                    console.error("Grades data is missing:", data);
                    setRows([]); // Порожній масив
                }
            })
            .catch((error) => console.error("Error fetching grades:", error));
    };



    return (
        <div className="wrapper">
            <Header />
            <main className="page">
                <div className="page__main-block main-block">
                    <div className="main-block__container _container">
                        <div className="containerForPieChart">
                            {/*<PieChart*/}
                            {/*    className="custom-pie-chart"*/}
                            {/*    margin={{top: 50, bottom: 30, left: 0, right: 10}}*/}
                            {/*    series={[*/}
                            {/*        {*/}
                            {/*            arcLabel: (item) => `${item.value}`,*/}
                            {/*            arcLabelMinAngle: 35,*/}
                            {/*            arcLabelRadius: '60%',*/}
                            {/*            data: pieDataFor21,*/}
                            {/*        },*/}
                            {/*    ]}*/}
                            {/*    colors={colors}*/}
                            {/*    legend={{*/}
                            {/*        position: {*/}
                            {/*            vertical: 'top',*/}
                            {/*            horizontal: 'center',*/}
                            {/*        },*/}
                            {/*        direction: 'row', // Розташування елементів легенди в ряд*/}
                            {/*    }}*/}


                            {/*/>*/}
                            <div className="chart-label">Атестація</div>
                        </div>
                        <h1 className="main-block__title">Оцінки студентів:</h1>
                        {rows.length > 0 ? (
                            <TableGrades
                                rows={rows}
                                columns={[
                                    {field: 'studentName', headerName: 'Студент'},
                                    {field: 'grade', headerName: 'Оцінка', align: 'center'}
                                ]}
                                title="Оцінки студентів"
                                className="table-container"
                            />
                        ) : (
                            <p>Немає доступних оцінок.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
