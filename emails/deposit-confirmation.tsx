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

interface DepositConfirmationEmailProps {
  userName: string
  amount: number
  transactionId: string
  date: string
}

export const DepositConfirmationEmail = ({
  userName = "Khách hàng",
  amount = 100000,
  transactionId = "DEP123456",
  date = new Date().toLocaleDateString("vi-VN"),
}: DepositConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Nạp tiền thành công - SellDigital</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>💰 Nạp Tiền Thành Công</Heading>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Xin chào {userName},</Text>
            
            <Text style={paragraph}>
              Giao dịch nạp tiền của bạn đã được xử lý thành công. Số dư tài khoản của bạn đã được cập nhật.
            </Text>

            <Section style={depositSection}>
              <Text style={sectionTitle}>📋 Thông Tin Giao Dịch</Text>
              
              <Section style={infoRow}>
                <Text style={infoLabel}>Mã giao dịch:</Text>
                <Text style={infoValue}>{transactionId}</Text>
              </Section>

              <Section style={infoRow}>
                <Text style={infoLabel}>Số tiền nạp:</Text>
                <Text style={infoValueHighlight}>
                  {amount.toLocaleString("vi-VN")} VNĐ
                </Text>
              </Section>

              <Section style={infoRow}>
                <Text style={infoLabel}>Thời gian:</Text>
                <Text style={infoValue}>{date}</Text>
              </Section>

              <Section style={infoRow}>
                <Text style={infoLabel}>Trạng thái:</Text>
                <Text style={statusSuccess}>✅ Thành công</Text>
              </Section>
            </Section>

            <Section style={tipSection}>
              <Text style={tipTitle}>💡 Gợi Ý</Text>
              <Text style={tipText}>
                • Bạn có thể kiểm tra số dư tài khoản trong trang "Tài khoản" của mình
              </Text>
              <Text style={tipText}>
                • Lịch sử giao dịch được lưu trữ và có thể xem lại bất cứ lúc nào
              </Text>
              <Text style={tipText}>
                • Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận hỗ trợ
              </Text>
            </Section>

            <Text style={paragraph}>
              Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của SellDigital!
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © 2024 SellDigital. All rights reserved.
            </Text>
            <Text style={footerText}>
              Email này được gửi tự động, vui lòng không trả lời.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default DepositConfirmationEmail

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
}

const header = {
  padding: "32px 40px",
  textAlign: "center" as const,
}

const h1 = {
  color: "#333",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
}

const content = {
  padding: "0 40px",
}

const greeting = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#333",
  marginBottom: "16px",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#555",
  marginBottom: "20px",
}

const depositSection = {
  margin: "32px 0",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "24px",
  border: "2px solid #4CAF50",
}

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#333",
  margin: "0 0 20px 0",
}

const infoRow = {
  marginBottom: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}

const infoLabel = {
  fontSize: "15px",
  color: "#666",
  margin: "0",
  fontWeight: "500",
}

const infoValue = {
  fontSize: "15px",
  color: "#333",
  margin: "0",
  fontWeight: "600",
}

const infoValueHighlight = {
  fontSize: "18px",
  color: "#4CAF50",
  margin: "0",
  fontWeight: "700",
}

const statusSuccess = {
  fontSize: "15px",
  color: "#4CAF50",
  margin: "0",
  fontWeight: "600",
}

const tipSection = {
  margin: "24px 0",
  backgroundColor: "#e3f2fd",
  borderRadius: "8px",
  padding: "20px",
}

const tipTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1976d2",
  margin: "0 0 12px 0",
}

const tipText = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#555",
  margin: "8px 0",
}

const footer = {
  padding: "24px 40px",
  textAlign: "center" as const,
  borderTop: "1px solid #eaeaea",
  marginTop: "32px",
}

const footerText = {
  fontSize: "12px",
  color: "#666",
  lineHeight: "20px",
  margin: "4px 0",
}
