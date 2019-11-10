import React from "react"
import { List, ListItem, Grid } from "@material-ui/core"
import { NavLink } from "react-router-dom"

export default function Header() {
  return (
    <header>
      <nav style={{ background: "#000", color: "#fff" }}>
        <List dense={true}>
          <Grid container justify="flex-end">
            <Grid item>
              <NavLink
                to="/"
                activeClassName="active"
                component={CustomListItem}
              >
                Dashboard
              </NavLink>
            </Grid>
            <Grid item>
              <NavLink
                to="/logout"
                activeClassName="active"
                component={CustomListItem}
              >
                Logout
              </NavLink>
            </Grid>
          </Grid>
        </List>
      </nav>
    </header>
  )
}

interface CustomListItemProps {
  children: React.ReactChildren
  href: string
}

const CustomListItem: React.FC<CustomListItemProps> = ({
  children,
  href,
  ...props
}: CustomListItemProps) => {
  return (
    // eslint-disable-next-line
    <ListItem button={true} divider={true} component="a" href={href}>
      {children}
    </ListItem>
  )
}
