export default async function handler(req, res) {
    // 允許跨域（讓前端可以呼叫）
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'No message' });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `
你是一個LINE健康助理AI。

請用超簡短繁體中文回答：

格式：
💡可能原因：一句話
🩺建議：一句話
⚠️就醫判斷：一句話

症狀：${message}
`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "AI暫時無法回應";
        
        res.status(200).json({ reply });
        
    } catch (err) {
        console.error("Gemini error:", err);
        res.status(500).json({ error: "AI錯誤" });
    }
}
