import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface SignInEmailProps {
  verificationCode: string;
  email: string;
}

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

let verifyPath = process.env.PATH_AUTH_VERIFY || "/auth/verify";

export const SignInEmail = ({ verificationCode, email }: SignInEmailProps) => (
  <Html>
    <Head />
    <Preview>Usa el codigo {verificationCode} para iniciar sesión.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/static/linear-logo.png`}
          width="42"
          height="42"
          alt="Classhub"
          style={logo}
        />
        <Heading style={heading}>
          Tu código de inicio de sesión en Classhub
        </Heading>
        <Section>
          <Text style={paragraph}>
            ¡Hola! Usa el siguiente código para iniciar sesión en Classhub:
          </Text>

          <div
            style={{
              backgroundColor: "#dfe1e4",
              borderRadius: "4px",
              padding: "1px 4px",
              color: "#3c4149",
              letterSpacing: "8px",
              fontWeight: "800",
              fontSize: "36px",
              margin: "0 auto",
              width: "min-content",
            }}
          >
            {verificationCode}
          </div>
          <Hr style={hr} />

          <Text style={paragraph}>
            ¿Cerraste la pestaña? No te preocupes, continua leyendo.
          </Text>

          <Text style={paragraph}>
            Puedes clickear el siguiente botón y serás redirigido a la pagina de
            inicio de sesión:
          </Text>

          <div
            style={{
              width: "max-content",
              margin: "0 auto",
            }}
          >
            <Button
              pY={11}
              pX={23}
              style={button}
              href={
                baseUrl +
                verifyPath +
                `?email=${email}&token=${verificationCode}`
              }
            >
              Login to ClassHub
            </Button>
          </div>
          <Hr style={hr} />

          <Text style={paragraph}>
            Si por alguna razón el boton no funciona, puedes copiar y pegar el
            siguiente link en tu navegador:
          </Text>
          <Link
            href={
              baseUrl + verifyPath + `?email=${email}&token=${verificationCode}`
            }
            style={{
              color: "#ea580c",
            }}
          >
            {baseUrl + verifyPath + `?email=${email}&token=${verificationCode}`}
          </Link>
          <Hr style={hr} />

          <Text style={paragraph}>
            Eso es todo por ahora. Si tienes alguna duda, no dudes en ponerte en
            contacto con nosotros. ¡Estamos aquí para ayudarte!
          </Text>

          <Text style={paragraph}>
            Sabías que... Este correo fue escrito en Callao. Se envió a São
            Paulo. Y desde São Paulo llegó a ti. (?) Todo eso tomó menos de 5
            segundos btw... 🤯.
          </Text>
          <Hr style={hr} />
          <Link href={baseUrl} style={reportLink}>
            Classhub
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
);

const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 16px 48px",
  width: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "8px 0 16px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const button = {
  backgroundColor: "#ea580c",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
};

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
};

const hr = {
  borderColor: "transparent",
  margin: "8px 0 12px",
};
