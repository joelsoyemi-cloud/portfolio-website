"use Client"
import { Box, Button, Typography } from "@mui/material"


export default function Body(){
    return(
        <>
            <Box  sx={{display: "flex", flexDirection: "column", gap: 4, marginTop: 10}}>
                <Typography>Available for new project</Typography>
                <Typography variant="h2" sx={{fontWeight: "bold"}}>
                    Building Digital experience with technical precision and creativity
                </Typography>
                <Typography>full stack developer specializing in building scalable web applications and high performance mobile interfaces.
                    meticulous code, modern asthestics.
                </Typography>
                <Box>
                    <Button variant="contained" sx={{backgroundColor: "black", color: "white"}}>
                        View my work
                    </Button>
                    <Button variant="outlined" sx={{color: "black", borderColor: "black", marginLeft: 2}}>
                        Learn More
                    </Button>
                </Box>
            </Box>
        </>
    )
}