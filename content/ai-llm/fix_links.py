#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re

lessons = [
    'math-01-vector', 'math-02-ops', 'math-03-matrix', 'math-03-transform', 'math-04-gradient', 'math-05-prob',
    'nn-01-neuron', 'nn-02-activation', 'nn-03-network', 'nn-03-loss', 'nn-04-softmax', 'nn-05-sgd', 'nn-06-backprop',
    'nlp-01-ngram', 'nlp-02-word2vec', 'nlp-03-ffnn-lm', 'nlp-04-rnn', 'nlp-05-lstm',
    'tf-01-attention', 'tf-02-multihead', 'tf-transformer', 'tf-03-tokenizer', 'tf-04-arch',
    'tf-05-residual', 'tf-06-training', 'tf-07-sparse', 'tf-08-moe', 'tf-09-distill',
    'tf-10-recap', 'tf-11-frontier',
    'appendix-transformer-3d', 'appendix-attention-paper',
]

count = 0
for slug in lessons:
    filename = f"{slug}.html"
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 修复课程链接：原站 /ai-llm/lessons/xxx -> xxx.html
        for target in lessons:
            content = content.replace(f'/ai-llm/lessons/{target}"', f'{target}.html"')
            content = content.replace(f'/ai-llm/lessons/{target}?', f'{target}.html?')
        
        # 修复卷链接：/ai-llm/volumes/x -> index.html
        content = content.replace('/ai-llm/volumes/1"', 'index.html"')
        content = content.replace('/ai-llm/volumes/2"', 'index.html"')
        content = content.replace('/ai-llm/volumes/3"', 'index.html"')
        content = content.replace('/ai-llm/volumes/4"', 'index.html"')
        content = content.replace('/ai-llm/volumes/5"', 'index.html"')
        
        # 修复 /ai-llm#map -> index.html
        content = content.replace('/ai-llm#map"', 'index.html"')
        content = content.replace('/ai-llm"', 'index.html"')
        
        # 移除点赞按钮
        content = re.sub(r'<button[^>]*class="[^"]*like-btn[^"]*"[^>]*>.*?</button>', '', content, flags=re.DOTALL)
        content = re.sub(r'<div[^>]*class="[^"]*like-btn-wrapper[^"]*"[^>]*>.*?</div>', '', content, flags=re.DOTALL)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        count += 1
        print(f"✓ {filename}")

print(f"\n✅ 已修复 {count} 个文件的链接！")
