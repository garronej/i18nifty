import { render } from "react-dom";
import { MyComponent1 } from "./Component1";
import { MyComponent2 } from "./Component2";

render(
	<>
		<MyComponent1 />
		<MyComponent2 />
	</>,
    document.getElementById("root"),
);