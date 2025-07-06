<?php

$para = "emylysantosguitar@gmail.com"; // <-- Altere para o e-mail da ONG
$assunto = "Formulário de Adoção";

$mensagem = "Formulário de Adoção:\n\n";
foreach ($_POST as $campo => $valor) {
    $campo_formatado = ucwords(str_replace("_", " ", $campo));
    $mensagem .= "$campo_formatado: $valor\n";
}

$cabecalho = "From: ".$_POST['email']."\r\n";
$cabecalho .= "Reply-To: ".$_POST['email']."\r\n";
$cabecalho .= "Content-Type: text/plain; charset=UTF-8\r\n";

$enviado = mail($para, $assunto, $mensagem, $cabecalho);

if ($enviado) {
    echo "<script>alert('Formulário enviado com sucesso! Após analisar entraremos em contato'); window.location.href='index.html';</script>";
} else {
    echo "<script>alert('Erro ao enviar. Tente novamente.'); window.location.href='formulario.html';</script>";
}

?>
