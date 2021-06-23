import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./pages/home";
import { NewRoom } from "./pages/newRoom";
import { AuthContextProvider } from "./contexts/AuthContext";
import { Room } from "./pages/room";



export function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/create" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}


