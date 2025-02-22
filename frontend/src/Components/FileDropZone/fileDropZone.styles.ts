import { Card, CardActions, styled, Typography } from "@mui/material";

export const CardContentContainer = styled("div")(({theme}) => ({
    border: "2px dashed #1976d2",
    padding: "20px",
    cursor: "pointer",
    borderRadius: "8px",
    backgroundColor: theme.palette.background.default
}));

export const DropZoneCard = styled(Card)(({theme}) => ({
    maxWidth: 400, 
    textAlign: "center", 
    padding: theme.spacing(2)
}));

export const UploadFileText = styled(Typography)(({theme}) => ({
    marginTop: theme.spacing(2)
}));

export const CardActionsContainer = styled(CardActions)(() => ({
    justifyContent: "center"
}));