import { SSTConfig } from "sst";
import { API, Web } from "./stacks/fivewords";

export default {
  config(_input) {
    return {
      name: "fivewords",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(API).stack(Web);
  }
} satisfies SSTConfig;
