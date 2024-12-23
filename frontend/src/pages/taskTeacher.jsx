import React, {useState, useEffect} from "react";
import {Header} from "../components/Header/Header";
import TableGrades from "../components/TableGrades/TableGrades";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useDispatch} from 'react-redux';
import {PieChart} from '@mui/x-charts/PieChart';
import {BarChart} from '@mui/x-charts/BarChart';
import {setSelectedTask} from '../slices/taskSlice';
import "../styles/taskTeacher.css";
import "../styles/reset.css";
import iconboxInfo from "../images/iconInfoBox.svg"; // Імпорт логотипа

export const TaskTeacher = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedTask = useSelector((state) => state.task.selectedTask);
    const selectedCourse = useSelector((state) => state.course.selectedCourse);
    const [stats, setStats] = useState(null); // Статистика подачі завдання
    const [assessedStat, setAssessedStat] = useState({assessedCount: 0, totalCount: 0}); // Стан для статистики оцінених відповідей
    const [grades, setGrades] = useState([]);
    const [categoriesGrades, setCategoriesGrades] = useState([]); // Оцінки для осі X
    const [series, setSeries] = useState([]); // Кількість для осі Y


    // Функція для отримання оцінок завдання
    async function getGradesForTask(taskId) {
        try {
            const response = await fetch(`/api/users/tasks/${taskId}/gradesTask`);

            // Перевірка статусу відповіді
            if (!response.ok) {
                throw new Error("Не вдалося отримати оцінки");
            }

            // Отримання даних у вигляді масиву оцінок
            const gradesData = await response.json();

            // Оновлення стану з отриманими оцінками
            setGrades(gradesData);


            // Підготовка даних для графіка
            const gradeCounts = gradesData.reduce((acc, grade) => {
                acc[grade] = (acc[grade] || 0) + 1; // Підрахунок кількості кожної оцінки
                return acc;
            }, {});

            const gradeArray = Object.keys(gradeCounts); // Оцінки для осі X
            const countArray = Object.values(gradeCounts); // Кількість для осі Y

            // Оновлення стану для графіка
            setCategoriesGrades(gradeArray);
            setSeries([{data: countArray}]);

        } catch (error) {
            console.error("Помилка при отриманні оцінок:", error);
        }
    }

    useEffect(() => {
        if (selectedCourse) {
            // Запит для отримання завдань
            fetch(`/api/users/getTasks/${selectedCourse._id}`)
                .then((response) => response.json())
                .then((data) => {
                    setTasks(data.tasks);

                    if (data.tasks.length > 0) {
                        // Використовуємо selectedTask з глобального стану
                        const taskId = selectedTask?._id; // Айді таски з стану
                        if (taskId) {
                            fetchGrades(taskId);
                            fetchTaskStats(taskId);
                            getAssessedTaskStats(taskId);
                            getGradesForTask(taskId);
                        }
                    }
                })
                .catch((error) => console.error("Error fetching tasks:", error));
        }
    }, [selectedCourse, selectedTask]); // Додаємо selectedTask в залежності useEffect

    const fetchGrades = (taskId) => {
        fetch(`/api/users/tasks/${taskId}/grades`)
            .then((response) => response.json())
            .then((data) => {
                // Перетворити отримані дані для таблиці
                const rows = data.map((item, index) => ({
                    id: index + 1, // Унікальний ідентифікатор для кожного рядка
                    studentName: item.userName,
                    grade: item.grade
                }));

                // Передати дані в таблицю
                setTableRows(rows);
            })
            .catch((error) => console.error("Error fetching grades:", error));
    };

    // Функція для запиту статистики подачі завдання
    const fetchTaskStats = (taskId) => {
        fetch(`/api/users/tasks/${taskId}/stats`)
            .then((response) => response.json())
            .then((data) => {
                if (data?.stats) {
                    setStats(data.stats); // Зберігаємо статистику в стан
                }
            })
            .catch((error) => console.error("Error fetching task stats:", error));
    };

    // Функція для запиту статистики оцінених відповідей
    const getAssessedTaskStats = (taskId) => {
        fetch(`/api/users/tasks/${taskId}/assessment-stats`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch assessed count');
                }
                return response.json(); // Перетворення відповіді у JSON
            })
            .then((data) => {
                if (data?.assessedCount !== undefined && data?.totalCount !== undefined) {
                    setAssessedStat({
                        assessedCount: data.assessedCount,
                        totalCount: data.totalCount,
                    }); // Зберігаємо статистику в стан
                }
            })
            .catch((error) => console.error('Error fetching assessed task stats:', error));
    };


    const colors = [
        "#027BFF", // Синий для аттестованных
        "#D2D6DE", // Светло-серый для неаттестованных
    ];
    const [tableRows, setTableRows] = useState([]);


    return (
        <div className="wrapper">
            <Header/>
            <main className="page">
                <div className="page__main-block main-block">
                    <div className="main-block__container _container">
                        <h1>Завдання: {selectedTask.title}</h1>

                        <div className="main-block__chart_group">
                            <div className="containerForPieChart">
                                {stats && (
                                    <PieChart
                                         // Задайте статичну ширину
                                        height={300}
                                        className="custom-pie-chart"
                                        margin={{top: 50, bottom: 30, left: 0, right: 10}}
                                        series={[
                                            {
                                                arcLabel: (item) => `${item.value}`,
                                                arcLabelMinAngle: 35,
                                                arcLabelRadius: '60%',
                                                data: [
                                                    {label: 'Здано', value: stats.totalSubmissions},
                                                    {label: 'Не здано', value: stats.notSubmitted},
                                                ],
                                            },
                                        ]}
                                        colors={colors}
                                        legend={{
                                            position: {
                                                vertical: 'top',
                                                horizontal: 'center',
                                            },
                                            direction: 'row', // Розташування елементів легенди в ряд
                                        }}
                                    />
                                )}
                            </div>
                            <div className="main-block__boxInfo">
                                <div className="main-block__text">
                                    {/* Виведення оцінених відповідей */}
                                    <span className="main-block__caption">
                                        Оцінено {assessedStat.assessedCount}/{assessedStat.totalCount}
                                    </span>
                                </div>
                                <div className="main-block__iconboxInfo">
                                    <img src={iconboxInfo} alt="iconboxInfo"/>
                                </div>
                            </div>
                            <div className="containerForBarChart">
                                <BarChart
                                    className="custom-bar-chart"
                                    series={series} // Дані для осі Y
                                    yAxis={[
                                        {
                                            label: "Кількість студентів", // Назва осі Y
                                        },
                                    ]}
                                    xAxis={[
                                        {
                                            data: categoriesGrades, // Коректний масив даних для осі X
                                            scaleType: "band", // Встановлено категорійний масштаб
                                            label: "Оцінки",
                                        },
                                    ]}

                                    colors={["#027BFF"]} // Колір графіка
                                    legend={{
                                        display: "none", // Вимикає легенду
                                    }}
                                    sx={{
                                        "& .MuiChartsLegend-root": {
                                            display: "none", // Вимикає легенду
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <h1 className="main-block__title">Оцінки студентів:</h1>
                        <TableGrades
                            rows={tableRows}
                            columns={[
                                {field: 'studentName', headerName: 'Студент'},
                                {field: 'grade', headerName: 'Оцінка', align: 'center'}
                            ]}
                            className="table-container"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};
