import { Hono } from "hono";

const app = new Hono();
const api = new Hono();

api.get("/greeting/:name/:birth{[0-9]{4}}", (c) => {
  const { name, birth } = c.req.param();
  return c.json({
    name: `こんにちは、${name}!`,
    birth: `Your birth is ${birth}`,
  });
});

// スラッシュのバグを避けるため、割り算は暫定で「_」や「div」にするのも手ですが、
// ここでは一般的な4つの記号をそのまま指定する書き方に直します。
api.get("/calc/:NUM1{[0-9]{1,4}}/:op{[+\\-*/]}/:NUM2{[0-9]{1,4}}", (c) => {
  const { NUM1, op, NUM2 } = c.req.param();

  // 1. 文字列で入ってくるので、計算できるように数値（Number）に変換する
  const num1 = Number(NUM1);
  const num2 = Number(NUM2);
  let result = 0;

  // 2. op（演算子）の値によって計算を切り分ける
  switch (op) {
    case "+":
      result = num1 + num2;
      break;
    case "-":
      result = num1 - num2;
      break;
    case "*":
      result = num1 * num2;
      break;
    case "/":
      // ゼロ除算（0で割る）のチェックを入れておくとプロっぽい！
      if (num2 === 0) {
        return c.json({ error: "Cannot divide by zero" }, 400);
      }
      result = num1 / num2;
      break;
    default:
      return c.json({ error: "Invalid operator" }, 400);
  }

  // 3. 計算結果をJSONで返す
  return c.json({
    NUM1: num1,
    op: op,
    NUM2: num2,
    result: result,
  });
});
app.route("/api", api);
export default app;
