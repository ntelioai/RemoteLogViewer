export class LogViewer {
    static SCRIPTR_URL = "wss://api.scriptrapps.io/"
    static logLevel = ["debug", "info", "warn", "error"]
    static RECEIVE_CHANNEL = "debug"

    constructor (attrs) {
        var template = `<pre class="LogViewer"></pre>`

        this.node = $(template)
        $(attrs.node).append(this.node)

        this._consoleLogging = attrs.consoleLogging || false;
        this._htmlLogging = attrs.htmlLogging || true
        this._onUpdate = attrs.onUpdate
        this._scriptFilter = ""
        this._token = attrs.token
        
        if (attrs.node) {
            if (attrs.node instanceof jQuery) {
                this._containerNode = attrs.node
            } else this._containerNode = $("#"+attrs.node)
        }

        this._containerNode.append(this.node)

        this.listenToChannel()
    }

    get() {
        return this.node
    }

    // Clears log and reopens connection if closed
    clear() {
        if (this.client.readyState !== WebSocket.OPEN) this.listenToChannel() 
        this.get().html("")
    }
    setToken(token) {
        this._token = token
        if (this.client) this.client.close() // Close existing connection
        this.listenToChannel() // Reconnect with the new token
    }

    listenToChannel() {
        var client = new WebSocket(LogViewer.SCRIPTR_URL + this._token)
        this.client = client

        // Subscribe to events sent by scriptr to device
        client.onopen = (event) => {
            client.send(JSON.stringify({
                "method":"Subscribe",
                "params":{
                    "channel": LogViewer.RECEIVE_CHANNEL
                }
            }), client);
        }
        client.onclose = (event) => {
            if (event.data) {
                var msg = JSON.parse(event.data)
                if (this._htmlLogging) if (typeof(msg.type) != "undefined") this.renderMessage(msg)     
            }
        }

        client.onmessage = (event) => {
            var msg = JSON.parse(event.data)

            if ((msg.type=="application") ) {
                if (this._htmlLogging) this.renderMessage(msg) 
            } else {
                if (msg.level==10) {	// This is a control message
                    if (msg.txt=="[CLEAR]") this.clear()
                } else {            
                    if (this._htmlLogging) if (typeof(msg.type) != "undefined") this.renderMessage(msg) 
                }                
            }       
        }        
    }    

    // This goes over existing nodes and hides those that are not in choices
    setLogLevels(choices = ['debug', 'info', 'warn', 'error', 'application']) {
        this._logLevels = choices.map(choice => choice.toLowerCase())

        // Filter existing messages
        this.get().children('.message').each((index, element) => {
            const $message = $(element)
            const messageLevel = $message.data("level").toLowerCase()
            const scriptText = $message.find('.script').text()
            
            if (this._logLevels.includes(messageLevel)) {
                if (!this._scriptFilter || scriptText.toLowerCase().includes(this._scriptFilter.toLowerCase())) {
                    $message.show(200) // Show with a slight animation
                } else {
                    $message.hide(200) // Hide with a slight animation
                }
            } else {
                $message.hide(200) // Hide with a slight animation
            }
        })
    }

    // Filter messages based on script name
    setScriptFilter(filter) {
        this._scriptFilter = filter;

        // Filter existing messages
        this.get().children('.message').each((index, element) => {
            const $message = $(element);
            const scriptText = $message.find('.script').text();
            const messageLevel = $message.data("level").toLowerCase();
            
            if (!this._scriptFilter || scriptText.toLowerCase().includes(this._scriptFilter.toLowerCase())) {
                // Show if filter is empty or script contains filter text
                if (this._logLevels && this._logLevels.includes(messageLevel)) {
                    $message.show(200); // Show with a slight animation
                } else {
                    $message.hide(200); // Hide with a slight animation
                }
            } else {
                $message.hide(200); // Hide with a slight animation
            }
        });
    }

    logEntryWidgetFactory(msg) {
        var widgetCls = LogEntryRenderer

        console.log(msg.componentName)

        if (msg.level == "APPLICATION") {
            switch (msg.componentName) {
                case "OpenAI":
                    widgetCls = OpenAIRenderer
                    break
                case "Similarity":
                    widgetCls = SimilarityRenderer
                    break
                case "PipelineRunner":
                    widgetCls = PipelineRunnerRenderer
                    break
            }
        }

        return new widgetCls(msg)
    }

    renderMessage(msg) {
        var logEntry = this.logEntryWidgetFactory(msg) //new WidgetCls(msg)

        //
        //  Insert log entry in DOM based on timestamp, this is imporant because
        //      WebSocket messages don't necessarily come in the right order
        //
        let inserted = false        
        const $container = this.get()
        const newTimestamp = new Date(msg.timestamp)
        $container.children('.message').each(function() {
            const currentTimestamp = new Date($(this).data('timestamp'))
            if (newTimestamp < currentTimestamp) {
                logEntry.get().insertBefore(this)
                inserted = true
                return false // Break the loop
            }
        })

        // If the new message is the latest, append it to the end
        if (!inserted) {
            $container.append(logEntry.get())
        }

        // Set initial visibility based on current log levels and script filter
        const scriptText = logEntry.get().find('.script').text();
        if (!this._logLevels.includes(msg.type) || 
            (this._scriptFilter && !scriptText.toLowerCase().includes(this._scriptFilter.toLowerCase()))) {
            logEntry.hide()
        }

        // Scroll to the bottom of the container
        $container.scrollTop($container[0].scrollHeight)
    }
}

class LogEntryRenderer {
    static syntaxHighlight(json) {
        if (json === null) return ""
        if ((typeof json) !== "string") return ""
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
          var cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    static template = `
            <div class="message" data-timestamp="{{timestamp}}" data-level="{{type}}"><span class='timestamp'>{{timestamp}}</span><span class='level'>{{type}}</span><span class='script'>[{{script}}]</span>&nbsp;{{component}}&nbsp;<span class='messageTxt {{type}}'>{{txt}}</span>
            <div class="widget"></div>
            </div>`

    constructor(attrs) {
        var logTxt = attrs?.txt ? LogEntryRenderer.syntaxHighlight(attrs.txt) : "";            

        let component = attrs.componentName? `[${attrs.componentName}]` : "" 

        var values = attrs 
        values.component = component
        values.txt = logTxt 
        var parsedTemplate = LogEntryRenderer.template.trim().replace(/\{\{([^}]+)\}\}/g, (match, key) => values[key])

        this.node = $(parsedTemplate)
        $(attrs.node).append(this.node)


        // super ({
        //     ...attrs, 
        //     template: LogEntryRenderer.template, 
        //     attrs: JSON.stringify(attrs, null, 3),
        //     component: component,
        //     txt: logTxt
        // })
    }

    get() {
        return this.node;
    }
}


class OpenAIRenderer extends LogEntryRenderer {
    render(vals) {
        var dialog = JSON.stringify(vals.dialog, null, 3)

        var html = `
            <table>
                <tr><td>Question</td><td><div class="question">${vals.question}</div></td></tr>
                <tr><td>Data Key</td><td><div class="template">${vals.dataKey}</div></td></tr>
                <tr><td>Model/Temp</td><td><div class="model"><span>${vals.model}</span> / <span>${vals.temperature}</span></div></td></tr>
                <tr><td>Template</td><td><div class="template">${vals.parsedTemplate}</div></td></tr>
                <tr><td>Dialog</td><td><div class="dialog">${dialog}</div></td></tr>
                <tr><td>Answer</td><td><div class="answer">${vals.answer}</div></td></tr>
                <tr><td>Performance</td><td><div class="performance">${vals.executionTime} ms / ${vals.totalTokens} Tokens</div></td></tr>                
            </table>
        `

        return html
    }

    constructor(attrs) {
        super(attrs)

        var $a = $(this.render({
            question: attrs.details.question,
            dataKey: attrs.details.context.botKey,
            temperature: attrs.details.context.temperature,
            model: attrs.details.context.modelName,
            parsedTemplate: attrs.details.parsedTemplate,
            dialog: attrs.details.dialog,
            answer: attrs.details.answer,
            executionTime: attrs.details.instrumentation.timing.totalRunningTime,
            totalTokens: attrs.details.instrumentation.usage.total_tokens,
        }))

        $a.appendTo(this.get().find(".widget"))
        this.get().addClass("openAI")
    }
}

class SimilarityRenderer extends LogEntryRenderer {
    render(vals) {

        var html = `
            <table>
                <tr><td>Question</td><td><div class="question">${vals.question}</div></td></tr>
                <tr><td>Data Key</td><td><div class="template">${vals.dataKey}</div></td></tr>
                <tr><td>Answer</td><td><div class="template">${vals.answer}</div></td></tr>
                <tr><td>Documents</td><td><div class="template">${vals.documentsFound}</div></td></tr>
                <tr><td>Performance</td><td><div class="performance">${vals.executionTime} ms</div></td></tr>                
            </table>
        `

        return html
    }

    constructor(attrs) {
        super(attrs)

        var $a = $(this.render({
            question: attrs.details.question,
            dataKey: attrs.details.botKey,
            answer: attrs.details.answer,
            documentsFound: attrs.details.documentsFound,
            executionTime: attrs.details.instrumentation.timing.totalRunningTime
        }))

        $a.appendTo(this.get().find(".widget"))
        this.get().addClass("openAI")

    }
}

class PipelineRunnerRenderer extends LogEntryRenderer {
    constructor(attrs) {
        super(attrs)
        console.log(attrs)
    }
}
