import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isActive } = await req.json();

    const product = await prisma.product.update({
      where: { id: params.id },
      data: { isActive },
    });

    return NextResponse.json({
      message: `Sản phẩm đã ${isActive ? "hiển thị" : "ẩn"} thành công`,
      product,
    });
  } catch (error) {
    console.error("Toggle product status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
