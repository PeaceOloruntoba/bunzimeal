export const toast = {
  success(msg: string) {
    console.log("✅", msg);
  },
  error(msg: string) {
    console.error("❌", msg);
  },
  info(msg: string) {
    console.log("ℹ️", msg);
  },
};
