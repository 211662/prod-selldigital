import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components"

interface OrderConfirmationEmailProps {
  name: string
  orderNumber: string
  productName: string
  quantity: number
  totalAmount: number
  accounts: Array<{
    username: string
    password: string
  }>
}

export default function OrderConfirmationEmail({
  name,
  orderNumber,
  productName,
  quantity,
  totalAmount,
  accounts,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Đơn hàng #{orderNumber} đã được xác nhận</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Đơn hàng của bạn đã sẵn sàng! ✨</Heading>
          
          <Text style={text}>
            Xin chào <strong>{name}</strong>,
          </Text>

          <Text style={text}>
            Cảm ơn bạn đã mua hàng tại SellDigital. Đơn hàng <strong>#{orderNumber}</strong> của bạn đã được xử lý thành công.
          </Text>

          <Section style={orderSection}>
            <Text style={orderTitle}>Chi tiết đơn hàng:</Text>
            <Text style={orderItem}>
              📦 Sản phẩm: <strong>{productName}</strong>
            </Text>
            <Text style={orderItem}>
              🔢 Số lượng: <strong>{quantity}</strong>
            </Text>
            <Text style={orderItem}>
              💰 Tổng tiền: <strong>{totalAmount.toLocaleString("vi-VN")} VNĐ</strong>
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={accountsSection}>
            <Text style={accountsTitle}>🔐 Thông tin tài khoản:</Text>
            {accounts.map((account, index) => (
              <Section key={index} style={accountBox}>
                <Text style={accountText}>
                  <strong>Tài khoản #{index + 1}</strong>
                </Text>
                <Text style={accountText}>
                  👤 Username: <strong>{account.username}</strong>
                </Text>
                <Text style={accountText}>
                  🔑 Password: <strong>{account.password}</strong>
                </Text>
              </Section>
            ))}
          </Section>

          <Section style={warningSection}>
            <Text style={warningText}>
              ⚠️ Lưu ý quan trọng:
            </Text>
            <Text style={warningItem}>
              • Vui lòng đổi mật khẩu ngay sau khi nhận tài khoản
            </Text>
            <Text style={warningItem}>
              • Không chia sẻ thông tin tài khoản cho bất kỳ ai
            </Text>
            <Text style={warningItem}>
              • Liên hệ hỗ trợ nếu gặp vấn đề với tài khoản
            </Text>
          </Section>

          <Text style={footer}>
            Chúc bạn có trải nghiệm tuyệt vời!<br />
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

const orderSection = {
  margin: "24px 0",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "20px 40px",
}

const orderTitle = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "12px",
}

const orderItem = {
  color: "#555",
  fontSize: "16px",
  lineHeight: "28px",
  margin: "8px 0",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
}

const accountsSection = {
  padding: "0 40px",
  margin: "24px 0",
}

const accountsTitle = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "16px",
}

const accountBox = {
  backgroundColor: "#fff3cd",
  border: "2px solid #ffc107",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
}

const accountText = {
  color: "#333",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "4px 0",
}

const warningSection = {
  margin: "24px 0",
  backgroundColor: "#fff3cd",
  borderRadius: "8px",
  padding: "20px 40px",
}

const warningText = {
  color: "#856404",
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "12px",
}

const warningItem = {
  color: "#856404",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
}

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  padding: "0 40px",
  marginTop: "32px",
}
