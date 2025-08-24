"""
HuggingFace Dataset Loader for Knowledge Heirloom
This script loads datasets from HuggingFace and prepares them for integration
"""

import sys
import json
import argparse
from datasets import load_dataset
from typing import List, Dict, Any

class HuggingFaceDatasetLoader:
    """Loads and processes HuggingFace datasets"""
    
    def __init__(self):
        self.supported_datasets = {
            # GLUE benchmark datasets
            "nyu-mll/glue": {
                "splits": ["ax", "cola", "mnli", "mrpc", "qnli", "qqp", "rte", "sst2", "stsb", "wnli"],
                "description": "General Language Understanding Evaluation benchmark",
                "tasks": ["text_classification", "natural_language_inference", "similarity"]
            },
            
            # Question Answering
            "squad": {
                "splits": ["train", "validation"],
                "description": "Stanford Question Answering Dataset",
                "tasks": ["question_answering"]
            },
            
            "natural_questions": {
                "splits": ["train", "validation"],
                "description": "Natural Questions from Google Search",
                "tasks": ["question_answering"]
            },
            
            # Knowledge and Information
            "wikipedia": {
                "splits": ["20220301.en"],
                "description": "Wikipedia articles dataset",
                "tasks": ["knowledge_base", "information_retrieval"]
            },
            
            "ms_marco": {
                "splits": ["train", "validation", "test"],
                "description": "Microsoft MARCO reading comprehension",
                "tasks": ["reading_comprehension", "passage_ranking"]
            },
            
            # Educational and Explanatory
            "eli5": {
                "splits": ["train_asks", "validation_asks", "test_asks"],
                "description": "Explain Like I'm 5 - complex topics explained simply",
                "tasks": ["explanation_generation", "educational"]
            },
            
            # Programming and Code
            "code_search_net": {
                "splits": ["train", "validation", "test"],
                "description": "Code search and documentation dataset",
                "tasks": ["code_search", "documentation"]
            },
            
            # Reasoning and Common Sense
            "commonsense_qa": {
                "splits": ["train", "validation", "test"],
                "description": "Common sense reasoning questions",
                "tasks": ["commonsense_reasoning", "multiple_choice"]
            },
            
            # Summarization
            "xsum": {
                "splits": ["train", "validation", "test"],
                "description": "BBC articles with single sentence summaries",
                "tasks": ["summarization"]
            },
            
            # Conversational
            "quac": {
                "splits": ["train", "validation"],
                "description": "Question Answering in Context",
                "tasks": ["conversational_qa", "context_understanding"]
            }
        }
    
    def load_dataset_sample(self, dataset_name: str, split: str = "train", limit: int = 100) -> List[Dict[str, Any]]:
        """Load a sample of data from specified dataset"""
        
        try:
            print(f"Loading {dataset_name} ({split}) - sample of {limit} entries...")
            
            # Handle special cases for dataset loading
            if dataset_name.startswith("nyu-mll/glue"):
                # GLUE datasets require specifying the task
                dataset = load_dataset("glue", split, split=split)
            elif dataset_name == "wikipedia":
                # Wikipedia requires language specification
                dataset = load_dataset("wikipedia", "20220301.en", split=split)
            else:
                # Standard dataset loading
                dataset = load_dataset(dataset_name, split=split)
            
            # Convert to list and limit
            samples = []
            for i, example in enumerate(dataset):
                if i >= limit:
                    break
                    
                # Process different dataset types
                processed_example = self._process_example(dataset_name, split, example)
                samples.append(processed_example)
            
            print(f"Successfully loaded {len(samples)} samples from {dataset_name}/{split}")
            return samples
            
        except Exception as e:
            print(f"Error loading dataset {dataset_name}/{split}: {str(e)}")
            return []
    
    def _process_example(self, dataset_name: str, split: str, example: Dict[str, Any]) -> Dict[str, Any]:
        """Process individual example based on dataset type"""
        
        processed = {
            "dataset": dataset_name,
            "split": split,
            "metadata": {
                "source": "huggingface",
                "original_keys": list(example.keys())
            }
        }
        
        # Process based on dataset type
        if "glue" in dataset_name.lower():
            processed.update(self._process_glue_example(split, example))
        elif dataset_name == "squad":
            processed.update(self._process_squad_example(example))
        elif dataset_name == "wikipedia":
            processed.update(self._process_wikipedia_example(example))
        elif dataset_name == "eli5":
            processed.update(self._process_eli5_example(example))
        elif dataset_name == "natural_questions":
            processed.update(self._process_nq_example(example))
        else:
            # Generic processing
            processed.update(self._process_generic_example(example))
        
        return processed
    
    def _process_glue_example(self, task: str, example: Dict[str, Any]) -> Dict[str, Any]:
        """Process GLUE dataset examples"""
        
        if task == "cola":
            return {
                "title": f"Grammar Acceptability: {example.get('sentence', '')[:50]}...",
                "text": example.get('sentence', ''),
                "label": example.get('label', 0),
                "category": "Grammar and Linguistics",
                "task_type": "acceptability_judgment"
            }
        elif task == "mnli":
            return {
                "title": f"Natural Language Inference: {example.get('premise', '')[:30]}...",
                "text": f"Premise: {example.get('premise', '')}\nHypothesis: {example.get('hypothesis', '')}",
                "label": example.get('label', 0),
                "category": "Natural Language Inference",
                "task_type": "textual_entailment"
            }
        elif task == "sst2":
            return {
                "title": f"Sentiment Analysis: {example.get('sentence', '')[:40]}...",
                "text": example.get('sentence', ''),
                "label": example.get('label', 0),
                "category": "Sentiment Analysis",
                "task_type": "binary_classification"
            }
        else:
            return {
                "title": f"GLUE {task.upper()}: {str(example)[:40]}...",
                "text": str(example),
                "category": "NLP Benchmark",
                "task_type": "classification"
            }
    
    def _process_squad_example(self, example: Dict[str, Any]) -> Dict[str, Any]:
        """Process SQuAD dataset examples"""
        return {
            "title": example.get('question', 'Question'),
            "text": f"Context: {example.get('context', '')}\n\nQuestion: {example.get('question', '')}\n\nAnswer: {example.get('answers', {}).get('text', [''])[0] if example.get('answers') else ''}",
            "category": "Question Answering",
            "task_type": "reading_comprehension",
            "question": example.get('question', ''),
            "context": example.get('context', ''),
            "answer": example.get('answers', {}).get('text', [''])[0] if example.get('answers') else ''
        }
    
    def _process_wikipedia_example(self, example: Dict[str, Any]) -> Dict[str, Any]:
        """Process Wikipedia dataset examples"""
        return {
            "title": example.get('title', 'Wikipedia Article'),
            "text": example.get('text', ''),
            "category": "Encyclopedia Knowledge",
            "task_type": "knowledge_base",
            "url": example.get('url', ''),
            "summary": example.get('text', '')[:200] + "..." if len(example.get('text', '')) > 200 else example.get('text', '')
        }
    
    def _process_eli5_example(self, example: Dict[str, Any]) -> Dict[str, Any]:
        """Process ELI5 dataset examples"""
        return {
            "title": example.get('title', 'ELI5 Question'),
            "text": f"Question: {example.get('title', '')}\n\nExplanation: {example.get('answers', {}).get('text', [''])[0] if example.get('answers') else ''}",
            "category": "Educational Explanations",
            "task_type": "explanation_generation",
            "question": example.get('title', ''),
            "explanation": example.get('answers', {}).get('text', [''])[0] if example.get('answers') else ''
        }
    
    def _process_nq_example(self, example: Dict[str, Any]) -> Dict[str, Any]:
        """Process Natural Questions dataset examples"""
        return {
            "title": example.get('question', {}).get('text', 'Natural Question'),
            "text": f"Question: {example.get('question', {}).get('text', '')}\n\nDocument: {example.get('document', {}).get('text', '')}",
            "category": "Natural Question Answering",
            "task_type": "open_domain_qa"
        }
    
    def _process_generic_example(self, example: Dict[str, Any]) -> Dict[str, Any]:
        """Generic processing for unknown dataset types"""
        # Try to extract meaningful text
        text_fields = ['text', 'sentence', 'content', 'passage', 'document']
        text = ""
        
        for field in text_fields:
            if field in example and example[field]:
                text = str(example[field])
                break
        
        if not text:
            text = str(example)
        
        return {
            "title": f"Dataset Entry: {text[:40]}...",
            "text": text,
            "category": "Dataset Sample",
            "task_type": "generic"
        }
    
    def get_available_datasets(self) -> Dict[str, Any]:
        """Get list of available datasets"""
        return self.supported_datasets

def main():
    """Main function for command line usage"""
    parser = argparse.ArgumentParser(description="Load HuggingFace datasets for Knowledge Heirloom")
    parser.add_argument("--dataset", required=True, help="Dataset name (e.g., squad, nyu-mll/glue)")
    parser.add_argument("--split", default="train", help="Dataset split (default: train)")
    parser.add_argument("--limit", type=int, default=100, help="Number of samples to load (default: 100)")
    parser.add_argument("--output", help="Output JSON file path")
    parser.add_argument("--list-datasets", action="store_true", help="List available datasets")
    
    args = parser.parse_args()
    
    loader = HuggingFaceDatasetLoader()
    
    if args.list_datasets:
        datasets = loader.get_available_datasets()
        print(json.dumps(datasets, indent=2))
        return
    
    # Load dataset
    samples = loader.load_dataset_sample(args.dataset, args.split, args.limit)
    
    result = {
        "dataset": args.dataset,
        "split": args.split,
        "sample_count": len(samples),
        "samples": samples
    }
    
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        print(f"Results saved to {args.output}")
    else:
        print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
