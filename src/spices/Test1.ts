import type Spice from "./Spice";

class Test1 implements Spice {
  name: string = "Test1";
  goesWellWith: Spice[] = [];
  description: string = "Test1";
}

export default Test1;
