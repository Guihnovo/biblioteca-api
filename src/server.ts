import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n📚 Biblioteca API rodando em http://localhost:${PORT}`);
  console.log(`   Acesse GET / para ver os endpoints disponíveis\n`);
});
