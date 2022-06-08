
<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $errors = [];
    $data = [];

    if (isset($_POST['article']) && isset($_POST['email'])) {

        $email = htmlspecialchars($_POST['email']);
        $message = $_POST['article'];
        $sujet = 'Nouveau message de article ';

        // Ici on traiter les données
        $toEmail = 'kontemamady750@gmail.com';

        $headers = ['From' => $email, 'Reply-To' => $email, 'Content-type' => 'text/html; charset=iso-8859-1'];

        $bodyParagraphs = [$message];
        $body = join(PHP_EOL, $bodyParagraphs);

        if (!mail($toEmail, $sujet, $body, $headers)) {

            $errors['error'] = "Oups, désolé quelque chose a mal tourné. Veuillez réessayer plus tard.";
        }

        if (!empty($errors)) {
            $data['success'] = false;
            $data['errors'] = $errors;
        } else {
            $data['success'] = true;
            $data['message'] = "Votre message a été envoyé avec succès";
        }
        echo json_encode($data);
    }
}
?>