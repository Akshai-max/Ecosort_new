import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Mock waste classification categories
const WASTE_CATEGORIES = [
  "plastic",
  "glass", 
  "paper",
  "metal",
  "organic",
  "electronic",
  "textile",
  "hazardous"
];

// Mock classification function that simulates ML inference
function mockClassifyWaste(): { category: string; confidence: number; description: string; disposal: string } {
  const category = WASTE_CATEGORIES[Math.floor(Math.random() * WASTE_CATEGORIES.length)];
  const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
  
  const descriptions = {
    plastic: "Plastic container or packaging material",
    glass: "Glass bottle or container",
    paper: "Paper or cardboard material", 
    metal: "Metal can or container",
    organic: "Food waste or organic material",
    electronic: "Electronic device or component",
    textile: "Clothing or fabric material",
    hazardous: "Potentially hazardous waste material"
  };

  const disposal = {
    plastic: "Recycle in plastic bin",
    glass: "Recycle in glass bin", 
    paper: "Recycle in paper bin",
    metal: "Recycle in metal bin",
    organic: "Compost or organic waste bin",
    electronic: "Take to e-waste collection center",
    textile: "Donate or textile recycling",
    hazardous: "Take to hazardous waste facility"
  };

  return {
    category,
    confidence: Math.round(confidence * 100) / 100,
    description: descriptions[category as keyof typeof descriptions],
    disposal: disposal[category as keyof typeof disposal]
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data with field 'image'" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Missing 'image' file field" },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Mock classification result
    const classification = mockClassifyWaste();
    
    // Mock overall accuracy
    const overallAccuracy = 0.94;

    return NextResponse.json({
      ...classification,
      overallAccuracy,
      timestamp: new Date().toISOString(),
      modelVersion: "mock-v1.0"
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("ML Classification Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}