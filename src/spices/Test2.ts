import type Spice from "./Spice";

class Test2 implements Spice {
  name: string = "Test2";
  goesWellWith: Spice[] = [];
  description: string = "Test2";
}

export default Test2;
