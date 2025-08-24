import express, { Request, Response } from 'express';
import { prisma } from '../prisma';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// HuggingFace Dataset Integration Service
class HuggingFaceDatasetService {
  // Popular datasets for Knowledge Management and AI training
  static RECOMMENDED_DATASETS = [
    {
      name: "nyu-mll/glue",
      splits: ["ax", "cola", "mnli", "mrpc", "qnli", "qqp", "rte", "sst2", "stsb", "wnli"],
      description: "General Language Understanding Evaluation (GLUE) benchmark - excellent for NLP tasks",
      category: "NLP",
      useCase: "Language understanding, text classification, sentiment analysis"
    },
    {
      name: "squad",
      splits: ["train", "validation"],
      description: "Stanford Question Answering Dataset - perfect for Q&A systems",
      category: "Question Answering",
      useCase: "Building chatbots and Q&A systems like Knowledge Heirloom"
    },
    {
      name: "ms_marco",
      splits: ["train", "validation", "test"],
      description: "Microsoft MARCO dataset for machine reading comprehension",
      category: "Reading Comprehension",
      useCase: "Document understanding and knowledge extraction"
    },
    {
      name: "wikipedia",
      splits: ["20220301.en"],
      description: "Wikipedia articles - vast knowledge base",
      category: "Knowledge Base",
      useCase: "General knowledge, fact-checking, information retrieval"
    },
    {
      name: "natural_questions",
      splits: ["train", "validation"],
      description: "Real questions from Google search with Wikipedia answers",
      category: "Question Answering",
      useCase: "Natural language Q&A systems"
    },
    {
      name: "eli5",
      splits: ["train_asks", "validation_asks", "test_asks"],
      description: "Explain Like I'm 5 - complex topics explained simply",
      category: "Educational",
      useCase: "Making complex topics accessible to beginners"
    },
    {
      name: "code_search_net",
      splits: ["train", "validation", "test"],
      description: "Code documentation and search dataset",
      category: "Programming",
      useCase: "Code understanding and documentation generation"
    },
    {
      name: "commonsense_qa",
      splits: ["train", "validation", "test"],
      description: "Common sense reasoning questions",
      category: "Reasoning",
      useCase: "Building AI that understands common sense"
    },
    {
      name: "xsum",
      splits: ["train", "validation", "test"],
      description: "BBC articles with single sentence summaries",
      category: "Summarization",
      useCase: "Automatic text summarization"
    },
    {
      name: "quac",
      splits: ["train", "validation"],
      description: "Question Answering in Context",
      category: "Conversational AI",
      useCase: "Context-aware chatbots and conversation systems"
    }
  ];

  // Simulate dataset loading (in real implementation, would use Python subprocess or API)
  static async loadDatasetSample(datasetName: string, split: string = "train", limit: number = 100) {
    // This would call Python script or HuggingFace API
    logger.info(`Loading dataset ${datasetName} (${split}) - sample of ${limit} entries`);
    
    // Simulated data structure based on common HuggingFace datasets
    const samples = [];
    
    for (let i = 0; i < Math.min(limit, 50); i++) {
      if (datasetName.includes("glue")) {
        samples.push({
          text: `Sample text from ${datasetName}/${split} entry ${i + 1}. This contains valuable training data for natural language understanding tasks.`,
          label: Math.floor(Math.random() * 2), // Binary classification
          category: "NLP Training Data",
          metadata: {
            dataset: datasetName,
            split: split,
            task: "text_classification",
            source: "huggingface"
          }
        });
      } else if (datasetName === "squad") {
        samples.push({
          question: `What is an important concept in ${datasetName} entry ${i + 1}?`,
          context: `This is the context paragraph that contains information needed to answer questions. It demonstrates how question-answering systems work and can be trained.`,
          answer: "question-answering systems",
          category: "Q&A Training Data",
          metadata: {
            dataset: datasetName,
            split: split,
            task: "question_answering",
            source: "huggingface"
          }
        });
      } else if (datasetName === "wikipedia") {
        samples.push({
          title: `Knowledge Article ${i + 1}`,
          text: `This is a comprehensive article about various topics from Wikipedia. It contains factual information that can be used to build knowledge bases and information retrieval systems.`,
          category: "Encyclopedia Knowledge",
          metadata: {
            dataset: datasetName,
            split: split,
            task: "knowledge_base",
            source: "huggingface"
          }
        });
      } else {
        samples.push({
          text: `Sample data from ${datasetName}/${split} entry ${i + 1}. This represents diverse training data for various AI applications.`,
          category: "AI Training Data",
          metadata: {
            dataset: datasetName,
            split: split,
            source: "huggingface"
          }
        });
      }
    }
    
    return samples;
  }
}

// Get available HuggingFace datasets
router.get('/huggingface/datasets', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Available HuggingFace datasets for Knowledge Heirloom",
    datasets: HuggingFaceDatasetService.RECOMMENDED_DATASETS,
    totalCount: HuggingFaceDatasetService.RECOMMENDED_DATASETS.length
  });
}));

// Load specific dataset
router.post('/huggingface/load', asyncHandler(async (req: Request, res: Response) => {
  const { datasetName, split = "train", limit = 100, integrate = false } = req.body;

  if (!datasetName) {
    throw createError('Dataset name is required', 400);
  }

  logger.info(`Loading HuggingFace dataset: ${datasetName}/${split}`);

  try {
    // Load sample data
    const sampleData = await HuggingFaceDatasetService.loadDatasetSample(datasetName, split, limit);
    
    // If integrate flag is true, save to knowledge base
    if (integrate) {
      let integratedCount = 0;
      
      for (const sample of sampleData) {
        try {
          let title = "";
          let content = "";
          
          if (sample.question) {
            title = sample.question;
            content = `Context: ${sample.context}\n\nAnswer: ${sample.answer}`;
          } else if (sample.title) {
            title = sample.title;
            content = sample.text || 'No content available';
          } else {
            title = `${datasetName} - Entry ${integratedCount + 1}`;
            content = sample.text || 'No content available';
          }

          await prisma.knowledgeBase.create({
            data: {
              title,
              content,
              category: sample.category || "HuggingFace Dataset",
              tags: JSON.stringify([datasetName, split, sample.metadata?.task || "general"]),
              priority: 2,
              source: "huggingface",
              keyWords: JSON.stringify([datasetName, split, "ai", "dataset", "training"]),
              summary: content.length > 200 ? content.substring(0, 200) + "..." : content
            }
          });
          integratedCount++;
        } catch (dbError) {
          logger.error(`Failed to integrate sample: ${dbError}`);
        }
      }
      
      // Create dataset record
      await prisma.dataset.create({
        data: {
          name: `${datasetName}/${split}`,
          description: `HuggingFace dataset: ${datasetName} (${split} split)`,
          source: "huggingface",
          dataType: "text",
          recordCount: integratedCount,
          processed: true,
          processedAt: new Date()
        }
      });
      
      logger.info(`Integrated ${integratedCount} samples from ${datasetName}/${split}`);
    }

    res.json({
      success: true,
      message: `Successfully loaded ${datasetName}/${split}`,
      data: {
        datasetName,
        split,
        sampleCount: sampleData.length,
        integrated: integrate,
        samples: sampleData
      }
    });

  } catch (error) {
    logger.error(`Error loading dataset ${datasetName}: ${error}`);
    throw createError(`Failed to load dataset: ${error}`, 500);
  }
}));

// Get integrated datasets
router.get('/integrated', asyncHandler(async (req: Request, res: Response) => {
  const datasets = await prisma.dataset.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const knowledgeCount = await prisma.knowledgeBase.groupBy({
    by: ['source'],
    _count: {
      id: true
    }
  });

  res.json({
    success: true,
    datasets,
    knowledgeStats: knowledgeCount
  });
}));

// Batch load multiple datasets
router.post('/batch-load', asyncHandler(async (req: Request, res: Response) => {
  const { datasets, integrate = false } = req.body;

  if (!datasets || !Array.isArray(datasets)) {
    throw createError('Datasets array is required', 400);
  }

  const results = [];
  
  for (const dataset of datasets) {
    try {
      const { name, split = "train", limit = 50 } = dataset;
      
      logger.info(`Batch loading: ${name}/${split}`);
      const sampleData = await HuggingFaceDatasetService.loadDatasetSample(name, split, limit);
      
      if (integrate) {
        // Integration logic similar to above
        let integratedCount = 0;
        for (const sample of sampleData) {
          try {
            await prisma.knowledgeBase.create({
              data: {
                title: `${name} - ${split} - Entry ${integratedCount + 1}`,
                content: sample.text || JSON.stringify(sample),
                category: sample.category || "Dataset Integration",
                tags: JSON.stringify([name, split, "batch-loaded"]),
                priority: 2,
                source: "huggingface",
                keyWords: JSON.stringify([name, split, "dataset"])
              }
            });
            integratedCount++;
          } catch (error) {
            logger.error(`Failed to integrate batch sample: ${error}`);
          }
        }
        
        await prisma.dataset.create({
          data: {
            name: `${name}/${split}`,
            description: `Batch loaded HuggingFace dataset: ${name}`,
            source: "huggingface",
            dataType: "text",
            recordCount: integratedCount,
            processed: true,
            processedAt: new Date()
          }
        });
      }
      
      results.push({
        dataset: name,
        split,
        status: "success",
        sampleCount: sampleData.length,
        integrated: integrate
      });
      
    } catch (error) {
      results.push({
        dataset: dataset.name,
        split: dataset.split,
        status: "error",
        error: (error as Error).message
      });
    }
  }

  res.json({
    success: true,
    message: `Batch loaded ${results.length} datasets`,
    results
  });
}));

// Quick setup with recommended datasets
router.post('/quick-setup', asyncHandler(async (req: Request, res: Response) => {
  logger.info('Starting quick setup with recommended datasets...');
  
  const quickDatasets = [
    { name: "nyu-mll/glue", split: "cola", limit: 25 },
    { name: "nyu-mll/glue", split: "mnli", limit: 25 },
    { name: "squad", split: "train", limit: 20 },
    { name: "wikipedia", split: "20220301.en", limit: 15 },
    { name: "eli5", split: "train_asks", limit: 15 }
  ];
  
  const results = [];
  let totalIntegrated = 0;
  
  for (const dataset of quickDatasets) {
    try {
      const sampleData = await HuggingFaceDatasetService.loadDatasetSample(
        dataset.name, 
        dataset.split, 
        dataset.limit
      );
      
      // Integrate into knowledge base
      for (const sample of sampleData) {
        try {
          await prisma.knowledgeBase.create({
            data: {
              title: sample.title || sample.question || `${dataset.name} Knowledge ${totalIntegrated + 1}`,
              content: sample.text || sample.context || JSON.stringify(sample),
              category: sample.category || "Quick Setup Dataset",
              tags: JSON.stringify([dataset.name, dataset.split, "quick-setup"]),
              priority: 3,
              source: "huggingface",
              keyWords: JSON.stringify([dataset.name, "ai", "dataset", "knowledge"]),
              summary: sample.text ? (sample.text.length > 150 ? sample.text.substring(0, 150) + "..." : sample.text) : "Quick setup knowledge entry"
            }
          });
          totalIntegrated++;
        } catch (error) {
          logger.error(`Failed to integrate quick setup sample: ${error}`);
        }
      }
      
      results.push({
        dataset: dataset.name,
        split: dataset.split,
        status: "success",
        integrated: sampleData.length
      });
      
    } catch (error) {
      results.push({
        dataset: dataset.name,
        split: dataset.split,
        status: "error",
        error: (error as Error).message
      });
    }
  }
  
  // Create summary dataset record
  await prisma.dataset.create({
    data: {
      name: "Quick Setup Collection",
      description: "Collection of recommended datasets for Knowledge Heirloom quick setup",
      source: "huggingface",
      dataType: "mixed",
      recordCount: totalIntegrated,
      processed: true,
      processedAt: new Date()
    }
  });
  
  logger.info(`Quick setup completed: ${totalIntegrated} entries integrated`);
  
  res.json({
    success: true,
    message: `Quick setup completed! Integrated ${totalIntegrated} knowledge entries`,
    totalIntegrated,
    results
  });
}));

export default router;
