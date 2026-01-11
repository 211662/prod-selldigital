import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface WelcomeEmailProps {
  name: string
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Chào mừng bạn đến với SellDigital!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Chào mừng đến SellDigital! 🎉</Heading>
          
          <Text style={text}>
            Xin chào <strong>{name}</strong>,
          </Text>

          <Text style={text}>
            Cảm ơn bạn đã đăng ký tài khoản tại SellDigital - nền tảng mua bán tài khoản số uy tín hàng đầu Việt Nam.
          </Text>

          <Section style={benefitsSection}>
            <Text style={benefitsTitle}>Bạn có thể:</Text>
            <Text style={benefitItem}>✅ Mua các tài khoản game, phần mềm chính hãng</Text>
            <Text style={benefitItem}>✅ Giao dịch nhanh chóng, bảo mật tuyệt đối</Text>
            <Text style={benefitItem}>✅ Được hỗ trợ 24/7 qua nhiều kênh</Text>
            <Text style={benefitItem}>✅ Tham gia chương trình đại lý với hoa hồng hấp dẫn</Text>
          </Section>

          <Text style={text}>
            Hãy bắt đầu khám phá các sản phẩm của chúng tôi ngay hôm nay!
          </Text>

          <Text style={footer}>
            Trân trọng,<br />
            Đội ngũ SellDigital
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 40px",
}

const benefitsSection = {
  padding: "0 40px",
  margin: "24px 0",
}

const benefitsTitle = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "12px",
}

const benefitItem = {
  color: "#555",
  fontSize: "16px",
  lineHeight: "28px",
  margin: "8px 0",
}

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  padding: "0 40px",
  marginTop: "32px",
}
