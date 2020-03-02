import Noty from "noty";
import "noty/lib/noty.css";

Noty.overrideDefaults({
  theme: "mint",
  closeWith: ["click", "button"],
  timeout: 2000
});

const toast = {
  error(text) {
    new Noty({ text, type: "error" }).show();
  },
  success(text) {
    new Noty({ text, type: "success" }).show();
  }
};

export default toast;
