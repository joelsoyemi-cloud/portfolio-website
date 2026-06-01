"use Client";

import { Box, Card, CardMedia, Typography,CardContent,Button, Link } from "@mui/material";



export default function Project(){
    return(
        <>
         <Box sx={{display: "flex", flexDirection: "column", gap: 4, marginTop: 10}}>
            <Typography variant="h2" sx={{fontWeight: "bold"}}>
               Selected work
            </Typography>
            <Typography>Here are some of my recent work</Typography>
          <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
      <CardMedia
        component="img"
        height="180"
        image="/project-image.jpg"   // Put your image in public folder
        alt="Project Image"
      />
      <CardContent>
        <Typography>React</Typography>
        <Typography gutterBottom variant="h5" component="div">
          Project Title
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Short description of your project. What problem it solves and technologies used.
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
       <Link>View Project</Link>
      </Box>
    </Card>



    <Box sx={{display: "flex", gap: 2, marginTop: 4}}>
        <Typography></Typography>
        <Button variant="contained" sx={{backgroundColor: "black", color: "white"}}>
            Get in touch
        </Button>
    </Box>
        </Box>
        </>
    )
}