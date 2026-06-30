#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re
import requests
from bs4 import BeautifulSoup

# 所有课程列表
lessons = [
    # 卷一
    ('math-01-vector', '什么是向量', '计算机只认识数字，它怎么知道「猫」和「老虎」比「猫」和「金鱼」更像？'),
    ('math-02-ops', '向量的常见运算', '「相似」可以被计算吗？——加法、点积、余弦相似度'),
    ('math-03-matrix', '什么是矩阵', '神经网络每一层把一组数字变成另一组数字——这个变换用什么来表示？'),
    ('math-03-transform', '什么是线性变换', '矩阵乘法到底在做什么？——把整个空间一起旋转、拉伸、搬动'),
    ('math-04-gradient', '什么是梯度', '蒙着眼睛站在山坡上，怎么走到山谷最低点？'),
    ('math-05-prob', '概率与信息', '神经网络的输出为什么叫「概率」？——从频率到交叉熵损失'),
    
    # 卷二
    ('nn-01-neuron', '神经元结构', '一个「脑细胞」是怎么工作的？——输入、加权、激活'),
    ('nn-02-activation', '激活函数', '为什么神经网络不能全是线性的？——非线性的力量'),
    ('nn-03-network', '神经网络与训练', '神经网络是怎么「学习」的？——前向传播与反向传播'),
    ('nn-03-loss', '损失函数', '怎么衡量「预测错了」？——从MSE到交叉熵'),
    ('nn-04-softmax', 'Softmax', '一组任意大小的分数，怎么变成一组加起来等于1的概率？'),
    ('nn-05-sgd', '梯度下降与优化器', '知道了往哪走是下坡，一步该迈多大？'),
    ('nn-06-backprop', '反向传播', '输出层错了，第一层的某个权重该负多大责任？'),
    
    # 卷三
    ('nlp-01-ngram', '语言的概率游戏：N-gram', '在「我爱」后面，最可能接哪个字？——统计语言模型的开端'),
    ('nlp-02-word2vec', '词向量', '「国王 - 男人 + 女人 ≈ 女王」是怎么做到的？'),
    ('nlp-03-ffnn-lm', '前馈神经网络语言模型', '用神经网络来预测下一个词——比N-gram强在哪里？'),
    ('nlp-04-rnn', 'RNN 循环神经网络', '句子长短不一，神经网络怎么处理任意长度的序列？'),
    ('nlp-05-lstm', 'LSTM 长短期记忆网络', 'RNN的记忆为什么传不远？——给记忆装上「阀门」'),
    
    # 卷四
    ('tf-01-attention', '注意力机制', '翻译「它」的时候，该看句子里的哪个词？'),
    ('tf-02-multihead', '多头注意力', '注意力只能有一种看法吗？——同时关注语法、语义、指代关系'),
    ('tf-transformer', 'Transformer 架构', '当注意力机制遇到残差连接和层归一化——质变发生了'),
    ('tf-03-tokenizer', 'Tokenizer 分词器', '大模型输入的不是字，不是词——那到底是什么？'),
    ('tf-04-arch', '编码器、解码器与大语言模型', '同样是Transformer，BERT为什么不能生成文章，GPT为什么是主流？'),
    ('tf-05-residual', '残差连接与层归一化', '96层Transformer——梯度怎么从第96层传回第1层而不消失？'),
    ('tf-06-training', '预训练 · 监督微调 · 强化学习', '「会接话」和「会帮忙」之间有一道鸿沟——ChatGPT的三个训练阶段'),
    ('tf-07-sparse', 'KV 缓存、稀疏注意力与 FlashAttention', '注意力的账单是O(n²)——处理一本书，工程师用什么手段把它变快？'),
    ('tf-08-moe', 'MoE 混合专家架构', 'GPT-4据说有1.8万亿参数——推理每次却只用其中一小部分，怎么做到的？'),
    ('tf-09-distill', '模型蒸馏', '大模型的能力能「传授」给小模型吗？——软标签里藏着什么「暗知识」？'),
    ('tf-10-recap', '串讲：从 N-gram 到 Transformer', '学了这么多细节，怎么把它们重新串成一条线？——每一代技术，都是来解上一代死结的'),
    ('tf-11-frontier', '前沿与未来：下一程', 'ChatGPT之后呢？——当下最活跃的研究方向，与大模型可能的演变'),
    
    # 附录
    ('appendix-transformer-3d', 'Transformer 3D 全景图', '一图看尽Transformer的每一层、每一个组件'),
    ('appendix-attention-paper', '《Attention Is All You Need》原文', '回到那篇改变了一切的论文——现在你能完全读懂它了'),
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}

# 获取卷号和课号
def get_volume_and_number(slug):
    if slug.startswith('math'):
        return ('一', slug.split('-')[-1].zfill(2))
    elif slug.startswith('nn'):
        num = int(slug.split('-')[-1])
        return ('二', str(num + 6).zfill(2))
    elif slug.startswith('nlp'):
        num = int(slug.split('-')[-1])
        return ('三', str(num + 13).zfill(2))
    elif slug.startswith('tf'):
        if 'transformer' in slug:
            return ('四', '21')
        elif 'recap' in slug:
            return ('四', '29')
        elif 'frontier' in slug:
            return ('四', '30')
        else:
            num = int(slug.split('-')[-1])
            return ('四', str(num + 18).zfill(2))
    elif 'appendix' in slug:
        if '3d' in slug:
            return ('五', '附1')
        else:
            return ('五', '附2')
    return ('一', '01')

print(f"开始处理 {len(lessons)} 节课...\n")

for idx, (slug, title, subtitle) in enumerate(lessons):
    url = f"https://www.xuanyuancode.com/ai-llm/lessons/{slug}"
    print(f"[{idx+1}/{len(lessons)}] 抓取: {slug} - {title}")
    
    try:
        r = requests.get(url, headers=headers, timeout=30)
        r.raise_for_status()
        
        # 提取主要内容
        soup = BeautifulSoup(r.text, 'html.parser')
        
        # 提取 lesson-body 内容
        lesson_body = soup.find('main', class_='lesson-body')
        
        if lesson_body:
            # 提取内容HTML
            body_html = str(lesson_body)
            
            # 提取下一课链接
            next_card = soup.find('a', class_='next-card')
            next_html = str(next_card) if next_card else ''
            
            # 获取卷号课号
            vol, num = get_volume_and_number(slug)
            
            # 生成页面 - 使用我们的模板风格
            page_html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>第{num}课 · {title} | AI大模型原理教程</title>
    <meta name="description" content="{subtitle}">
    <meta name="keywords" content="AI大模型教程,Transformer,{title},深度学习">
    <style>
        :root {{
            --bg: #0a0a1a;
            --card-bg: #12122a;
            --text: #e0e0ff;
            --text-secondary: #a0a0c8;
            --accent: #7c3aed;
            --accent2: #06b6d4;
            --border: #2a2a5a;
            --code-bg: #0d0d1a;
            --tag-bg: #1e1e3e;
        }}
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.8;
            min-height: 100vh;
        }}
        .container {{
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            background: linear-gradient(135deg, #1a1a3e, #4a1a6b);
            border-radius: 16px;
            padding: 32px 40px;
            margin-bottom: 28px;
            box-shadow: 0 8px 32px rgba(124, 58, 237, 0.2);
            position: relative;
            overflow: hidden;
        }}
        .header .lesson-badge {{
            display: inline-block;
            background: linear-gradient(135deg, var(--accent), var(--accent2));
            color: #fff;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 16px;
        }}
        .header h1 {{
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }}
        .header .subtitle {{
            font-size: 16px;
            color: rgba(255,255,255,0.7);
            font-style: italic;
            margin-top: 12px;
        }}
        .breadcrumb {{
            margin-bottom: 20px;
            font-size: 14px;
            color: var(--text-secondary);
        }}
        .breadcrumb a {{
            color: var(--accent2);
            text-decoration: none;
        }}
        .breadcrumb a:hover {{
            text-decoration: underline;
        }}
        .nav-links {{
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            gap: 20px;
        }}
        .nav-links a {{
            flex: 1;
            padding: 16px 24px;
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            text-decoration: none;
            color: var(--text);
            transition: all 0.2s;
        }}
        .nav-links a:hover {{
            border-color: var(--accent2);
            transform: translateY(-2px);
        }}
        .nav-links .nav-label {{
            font-size: 12px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        .nav-links .nav-title {{
            font-size: 16px;
            font-weight: 600;
            margin-top: 4px;
            color: var(--accent2);
        }}
        
        /* 课程内容样式 */
        .lesson-body {{
            font-size: 16px;
            line-height: 1.9;
        }}
        .station {{
            background: var(--card-bg);
            border-radius: 12px;
            margin-bottom: 24px;
            padding: 24px;
            border: 1px solid var(--border);
        }}
        .station-head {{
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border);
        }}
        .station-no {{
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--accent2), var(--accent));
            border-radius: 10px;
            font-weight: 700;
            font-size: 14px;
            color: #fff;
        }}
        .station-title {{
            font-size: 20px;
            font-weight: 700;
        }}
        .station h2 {{
            font-size: 20px;
            margin: 0;
        }}
        .station p {{
            margin-bottom: 16px;
        }}
        .station strong {{
            color: var(--accent2);
        }}
        .formula {{
            background: rgba(124, 58, 237, 0.1);
            padding: 16px 24px;
            border-radius: 12px;
            margin: 20px 0;
            text-align: center;
            font-family: 'JetBrains Mono', monospace;
            font-size: 16px;
            border: 1px solid rgba(124, 58, 237, 0.3);
            overflow-x: auto;
        }}
        .think {{
            background: rgba(16, 185, 129, 0.08);
            border: 1px dashed #10b981;
            border-radius: 12px;
            padding: 20px 24px;
            margin: 24px 0;
            position: relative;
        }}
        .think::before {{
            content: '💡';
            position: absolute;
            top: -12px;
            left: 20px;
            background: var(--card-bg);
            padding: 0 8px;
            font-size: 20px;
        }}
        .think-q {{
            font-weight: 600;
            color: #10b981;
            margin-bottom: 12px;
            font-size: 16px;
        }}
        .takeaway {{
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
        }}
        .takeaway-label {{
            font-size: 14px;
            font-weight: 700;
            color: #10b981;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
        }}
        .recap {{
            background: rgba(245, 158, 11, 0.08);
            border: 1px solid rgba(245, 158, 11, 0.3);
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
        }}
        .recap h3 {{
            color: #f59e0b;
            margin-bottom: 16px;
            font-size: 18px;
        }}
        .recap ul {{
            padding-left: 20px;
        }}
        .recap li {{
            margin-bottom: 8px;
        }}
        code {{
            background: var(--code-bg);
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 14px;
            font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
            color: var(--accent2);
        }}
        pre {{
            background: var(--code-bg);
            padding: 16px 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 16px 0;
            border: 1px solid var(--border);
        }}
        pre code {{
            background: none;
            padding: 0;
            color: #10b981;
        }}
        .fig {{
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
            text-align: center;
            overflow-x: auto;
        }}
        .fig svg {{
            max-width: 100%;
            height: auto;
        }}
        .figcaption {{
            margin-top: 16px;
            font-size: 14px;
            color: var(--text-secondary);
            text-align: left;
        }}
        .fig-no {{
            color: var(--accent2);
            font-weight: 600;
        }}
        .quiz {{
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
        }}
        .quiz-title {{
            font-size: 18px;
            font-weight: 700;
            color: #8b5cf6;
            margin-bottom: 16px;
        }}
        .quiz-question {{
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border);
        }}
        .quiz-question:last-child {{
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }}
        .quiz-q {{
            font-weight: 600;
            margin-bottom: 12px;
        }}
        .quiz-options {{
            padding-left: 20px;
        }}
        .quiz-option {{
            margin-bottom: 8px;
            color: var(--text-secondary);
        }}
        .next-card {{
            display: block;
            background: linear-gradient(135deg, var(--card-bg), rgba(124, 58, 237, 0.1));
            border-radius: 12px;
            padding: 24px;
            border: 1px solid var(--border);
            text-align: center;
            margin-top: 28px;
            transition: all 0.2s;
            text-decoration: none;
            color: inherit;
        }}
        .next-card:hover {{
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(124, 58, 237, 0.2);
            border-color: var(--accent2);
        }}
        .next-label {{
            font-size: 14px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        .next-card h3 {{
            font-size: 20px;
            color: var(--accent2);
            margin: 8px 0;
        }}
        .next-card p {{
            color: var(--text-secondary);
            font-size: 14px;
        }}
        .next-arrow {{
            font-size: 24px;
            margin-left: 8px;
        }}
        .lesson-footer {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid var(--border);
            font-size: 14px;
            color: var(--text-secondary);
        }}
        .lesson-footer a {{
            color: var(--accent2);
            text-decoration: none;
        }}
        .lesson-footer a:hover {{
            text-decoration: underline;
        }}
        ul, ol {{
            padding-left: 24px;
            margin-bottom: 16px;
        }}
        li {{
            margin-bottom: 8px;
        }}
        @media (max-width: 600px) {{
            .container {{ padding: 12px; }}
            .header {{ padding: 24px; }}
            .header h1 {{ font-size: 22px; }}
            .station {{ padding: 16px; }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="breadcrumb">
            <a href="/">🏠 首页</a> / <a href="/ai-llm/">AI大模型教程</a> / 第{num}课
        </div>

        <div class="header">
            <div class="lesson-badge">LESSON {num} · 卷{vol}</div>
            <h1>{title}</h1>
            <p class="subtitle">❝ {subtitle} ❞</p>
        </div>

        <div class="lesson-body">
            {body_html}
        </div>

        <div class="lesson-footer">
            <span>卷{vol} · 第{num}课</span>
            <a href="/ai-llm/">返回学习地图</a>
        </div>
    </div>
</body>
</html>"""
            
            # 保存文件
            with open(f"{slug}.html", 'w', encoding='utf-8') as f:
                f.write(page_html)
            
            print(f"  ✓ 已保存: {slug}.html ({len(body_html)} 字符)")
            
        else:
            print(f"  ✗ 未找到 lesson-body 内容")
            
    except Exception as e:
        print(f"  ✗ 错误: {e}")

print(f"\n✅ 处理完成！共 {len(lessons)} 节课")
