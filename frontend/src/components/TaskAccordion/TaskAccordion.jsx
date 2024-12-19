import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box } from "@mui/material";

// Компонент Accordion для відображення завдання
export const TaskAccordion = ({ subjectName, status, score, comment }) => {
    const isSubmitted = status === "Здано"; // Перевірка статусу

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel-content"
                id="panel-header"
            >
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                    <Typography variant="h6">{subjectName}</Typography>
                    <Box display="flex" alignItems="center" ml={2}>
                        <Typography color={isSubmitted ? "green" : "red"} mr={1}>
                            {status}
                        </Typography>
                        {isSubmitted && <CheckCircleIcon color="success" fontSize="medium" />}
                    </Box>

                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body1">
                    <strong>Оцінка:</strong> {score} балів
                </Typography>
                <Typography variant="body1">
                    <strong>Коментар:</strong> {comment}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
};
