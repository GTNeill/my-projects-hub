import { Route, Switch } from "wouter";
import Index from "./pages/index";
import Admin from "./pages/admin";
import { Provider } from "./components/provider";
import { MadeWithRunable } from "./components/made-with-runable";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/admin" component={Admin} />
      </Switch>
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<MadeWithRunable />}
    </Provider>
  );
}

export default App;
