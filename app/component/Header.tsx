"use client";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  Link as MuiLink,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import NextLink from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "Projects", href: "/" },
    { label: "About", href: "#" },
    { label: "Experience", href: "#" },
    { label: "Contact", href: "#" },
  ];

  return (
    <>
      <AppBar sx={{ backgroundColor: "white" }}>
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }}>
            Dedeibe Michael
          </Typography>

          {/* Desktop navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 4,
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            {navLinks.map((link) => (
              <MuiLink
                key={link.label}
                component={NextLink}
                href={link.href}
                underline="none"
                sx={{ color: "black", "&:hover": { textDecoration: "underline" } }}
              >
                {link.label}
              </MuiLink>
            ))}
          </Box>

          {/* Mobile menu button */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: "black" }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Hire Me button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              display: { xs: "none", md: "flex" },
            }}
          >
            Hire me
          </Button>
        </Toolbar>
      </AppBar>

      {/* Mobile sidebar */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(false)}>
          <List>
            {navLinks.map((link) => (
              <ListItem button key={link.label} component={NextLink} href={link.href}>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "black", color: "white" }}
            >
              Hire me
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
