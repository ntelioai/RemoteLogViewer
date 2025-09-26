import { LogViewer } from "./LogViewer.js";
import { LocalSessionStorage} from "./LocalSessionStorage.js";

$(document).ready(function () {


  function onSelectionChange(choices) {
    logViewer.setLogLevels(choices)
    console.log("Selected choices:", choices);
    // You can add your custom logic here
  } 

  if (LocalSessionStorage.getItem("log.viewer.token")) $("#authToken").val(LocalSessionStorage.getItem("log.viewer.token"))

  if (LocalSessionStorage.getItem("log.viewer.levelsSelection")==null) LocalSessionStorage.setItem("log.viewer.levelsSelection", ["info", "error", "debug", "warn", "application"]) 

  $("#authToken").change(function() {
    console.log($("#authToken").val())
    logViewer.setToken($("#authToken").val())
    LocalSessionStorage.setItem("log.viewer.token", $("#authToken").val())
  })

  if ($("#scriptFilter").length > 0) {
  } else { 
    console.log("You have to enter the token to view the logs")
  }

  var logViewer = new LogViewer({
      node: $(".content-div"), 
      consoleLogging: true, 
      htmlLogging: true,
      token: LocalSessionStorage.getItem("log.viewer.token")?LocalSessionStorage.getItem("log.viewer.token"):""
  })

  $('.selectpicker').selectpicker();
    
  $('.selectpicker').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
      onSelectionChange($(this).val());
      LocalSessionStorage.setItem("log.viewer.levelsSelection", $(this).val())
      logViewer.setLogLevels($(this).val())
  });

  $("#clearButton").click(function(){
    logViewer.clear()
  })

  function initializePicker(choices) {
    const select = $('.selectpicker');
    
    // Clear existing options
    select.empty();
    
    // Add new options
    choices.forEach(choice => {
        select.append($('<option>', {
            value: choice,
            text: choice
        }));
    });
    
    // Initialize or refresh the selectpicker
    select.selectpicker('refresh');
    
    // Set up the change event listener
    select.on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
        onSelectionChange($(this).val());
    });
  }


  function initializePickerSelection(selectedChoices) {
    const select = $('.selectpicker');
    
    // Deselect all options
    select.selectpicker('deselectAll');
    
    // Select the options specified in the array
    select.selectpicker('val', selectedChoices);
    
    // Refresh the selectpicker to reflect the changes
    select.selectpicker('refresh');
    
    // Trigger the change event to call onSelectionChange
    onSelectionChange(selectedChoices);
  }

  function clearLog() {
    logViewer.clear()
  }



  var selection = LocalSessionStorage.getItem("log.viewer.levelsSelection")

  initializePickerSelection(selection)

  logViewer.setLogLevels(selection)

  // Ensure the element exists before attaching the event listener
  const scriptFilter = $("#scriptFilter");
  scriptFilter.on("input", function() {

    var selectedValue = $(this).val();
    console.log(selectedValue)

    if (selectedValue) {

      $(".LogViewer .message").each(function() {
        // Get the text content of the .script element inside this message
        var scriptText = $(this).find(".script").text();
        // Check if the script text contains "pipeline"
        if (scriptText.includes(selectedValue)) {
          // Show this message
          $(this).show();
        } else {
          // Hide this message
          $(this).hide();
        }
      });

    } else {
      $(".LogViewer .message").each(function() {
        $(this).show();
      })
    }

  });


  //test(logViewer)

})


function test(logViewer) {

  var msg = {
    "type": "application",
    "script": "/v1.1/lib/pipeline/runner",
    "componentName": "OpenAI",
    "timestamp": "2024-09-11T16:21:55.970Z",
    "params": {
        "url": "https://api.openai.com/v1/chat/completions",
        "api_key": "sk-proj-123412341234123412341234",
        "temperature": 0.1,
        "modelName": "gpt-3.5-turbo-16k",
        "today": "2024-09-11T16:21:53.380Z",
        "question": "How can you help SAP customers?",
        "botKey": "B061E58020B0AE791463703CC862291D",
        "context": "[{\"question\": \"Solutions\", \"answer\": \"<h2>Enterprise AI Assistants</h2><p>Transform your enterprise with AI assistants that understand and respond to your business data. Our AI assistants accelerate decision-making and boost productivity by more than 50%, providing valuable insights and recommendations.</p><h2>Conversational Apps</h2><p>Build powerful conversational applications with ntelio.ai. Our platform uses Retrieval Augmented Generation (RAG) and Vector Augmented RAG (VARAG) to accurately answer questions and solve tasks using your enterprise data as the source of truth.</p><h2>Semantic Search Solutions</h2><p>Enhance your search capabilities with our multi-lingual semantic search solutions. ntelio.ai improves the relevance of search results, making it easier for users to find the information they need from your existing data sources.</p><h2>Chatbots and Knowledge Assistants</h2><p>Create sophisticated chatbots and knowledge assistants that deliver accurate, data-driven conversations. Our customizable UI components can be easily integrated into your user experience, providing seamless interactions for customers, employees, and partners.</p><h2>User Interface Augmentation</h2><p>Break down the barriers of traditional user interfaces with our conversational UI. ntelio.ai integrates with your systems, allowing users to interact with your applications through natural language, improving usability and engagement.</p>\"}][{\"question\": \"Features\", \"answer\": \"<h2>Turnkey Solutions</h2><p>ntelio.ai offers a self-contained cluster providing out-of-the-box multi-LLM deployment capability, fine-tuning, RAG/VARAG, extensive AI, integration & management APIs, endpoint ACL-based security, LDAP/Active Directory integration, and configurable UI components for ease of integration into end-user applications.</p><h2>Real-Time Data Ingestion and IoT Support</h2><p>Real-time ingestion of IoT data sources with wide support for major device platforms. Our LLMs analyze vast amounts of data from sensors, providing valuable insights and recommendations.</p><h2>Multi-Cloud and On-Premise Deployment</h2><p>Built on a best-of-breed microservices architecture, ntelio.ai is fully managed and deployable on AWS, Azure, GCP, and private data centers, ensuring scalability and flexibility.</p><h2>RAG/VARAG Technology</h2><p>Using Large Language Models directly is prone to hallucination and bias. Our RAG/VARAG technology ensures that knowledge retrieval is grounded in enterprise data, which is the only source of truth.</p><h2>Security and Privacy Features</h2><p>Our platform guarantees full data privacy and total control by the enterprise. All user interface elements or API endpoints are protected by role-based Access Control Lists (ACL).</p>\"}][{\"question\": \"Industries\", \"answer\": \"<h2>Healthcare</h2><p>ntelio.ai enhances healthcare operations by providing accurate data analysis, patient interactions, and administrative automation. Our AI solutions help in making informed decisions, improving patient care, and optimizing resource management.</p><h2>Finance</h2><p>In the finance industry, ntelio.ai aids in fraud detection, customer support, financial forecasting, and regulatory compliance. Our AI-driven insights help financial institutions stay ahead in a competitive market.</p><h2>Retail</h2><p>Our platform transforms the retail experience by enabling personalized customer interactions, inventory management, demand forecasting, and enhancing the overall shopping experience.</p><h2>Manufacturing</h2><p>ntelio.ai supports manufacturing operations by optimizing supply chain management, predictive maintenance, quality control, and enhancing productivity through AI-driven insights.</p><h2>Other Industries</h2><p>Our solutions are adaptable to various industries including logistics, education, energy, and more. ntelio.ai's flexible and scalable AI capabilities cater to the unique needs of diverse sectors.</p>\"}][{\"question\": \"Architecture\", \"answer\": \"<p><strong>Serverless container</strong></p><p>Our serverless container enables the creation of new endpoints to wrap and augment internal or external APIs with logic or security rules. It provides robust ad-hoc secure API creation &amp; orchestration, business rules execution, data filtering &amp; transformation and UI serving.</p><p><strong>IDE and admin UI</strong></p><p>A web based IDE for development, debugging, source code control &amp; lifecycle of serverless endpoints. IDE plugins for dashboard creation, business rules, visual development. User friendly administration UI.</p><p><strong>Multi protocol</strong></p><p>Support for standard REST as well as WebSocket &amp; MQTT for real time communications.</p><p><strong>Model management</strong></p><p>Import any HugginFace or network storage hosted model for fine tuning and inference. Run inference on multiple models simultaneously.<br><br><strong>User directory, ACLs &amp; Token management</strong></p><p>All endpoints are protected by role based Access Control Lists. Tokens are revokable. The user directory can be integrated with LDAP or Active Directory. Support for SAML based single-sign-on.</p><p><strong>UI widgets</strong></p><p>AI Playground, dashboards and other UI artifacts are available in the IDE for customization and integration into end-customer apps.</p><p><strong>Databases</strong></p><p>Out of the box deployment of various database technologies to facilitate the development of LLM, RAG and IoT/LLM applications.</p><p><strong>Cluster management</strong></p><p>All container, configuration, resource management and monitoring are available in the standard distribution.</p>\"}][{\"question\": \"Technology\", \"answer\": \"<h2>Large Language Models (LLMs)</h2><p>ntelio.ai supports a wide range of open-source and commercial LLMs, including those available through Huggingface and providers like OpenAI, Cohere, Google, and Anthropic. Multiple LLMs and document embedding databases can be deployed for task specialization.</p><h2>Integration Capabilities</h2><p>Our platform connects to your enterprise data sources through a range of connectors, enabling comprehensive knowledge retrieval for generated conversations, classifications, summaries, FAQs, and integrations.</p><h2>Microservices Architecture</h2><p>Built on a microservices architecture, ntelio.ai ensures high availability, scalability, and ease of maintenance. This architecture supports multi-cloud and on-premise deployments, providing flexibility for diverse enterprise needs.</p><h2>Data Connectors</h2><p>Seamlessly integrate with a wide range of data sources, including Amazon S3, DynamoDB, IoT, Box, Confluence, Dropbox, Elasticsearch, Google BigQuery, Drive, Mail, Sheets, Docs, Storage, GraphQL, SQL Databases, Microsoft Azure, MongoDB, SalesForce, SAP, and more.</p><h2>Multi-Tenancy Support</h2><p>Our platform supports multi-tenancy, allowing one instance to serve multiple entities with complete data isolation, ensuring privacy and security across all tenants.</p>\"}]",
        "template": "You are a helpful chatbot answering User Requests, answer only from Context.\nif you don't know the reply, answer with this word: DONTKNOW \n\nContext: {{context}}\nUser Request: {{question}}"
    },
    "dialog": {
        "_history": [
            {
                "role": "user",
                "content": "How can you help SAP customers?"
            },
            {
                "role": "assistant",
                "content": "ntelio.ai can help SAP customers in several ways. Our AI solutions can enhance various aspects of your business operations, including data analysis, customer interactions, administrative automation, fraud detection, financial forecasting, regulatory compliance, personalized customer interactions, inventory management, demand forecasting, supply chain management, predictive maintenance, quality control, and more. We provide AI-driven insights that can help SAP customers make informed decisions and optimize resource management. Additionally, our platform integrates seamlessly with SAP systems and other data sources to provide accurate and data-driven conversations through chatbots and knowledge assistants."
            }
        ]
    },
    "answer": "ntelio.ai can help SAP customers in several ways. Our AI solutions can enhance various aspects of your business operations, including data analysis, customer interactions, administrative automation, fraud detection, financial forecasting, regulatory compliance, personalized customer interactions, inventory management, demand forecasting, supply chain management, predictive maintenance, quality control, and more. We provide AI-driven insights that can help SAP customers make informed decisions and optimize resource management. Additionally, our platform integrates seamlessly with SAP systems and other data sources to provide accurate and data-driven conversations through chatbots and knowledge assistants.",
    "citations": []
}
  logViewer.printMessage(logViewer.applicationTemplate(msg))

}
