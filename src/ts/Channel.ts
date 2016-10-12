class Channel {
    private topics: any = [];

    constructor(private name: string) { }

    /**
     * This function returns a topic object with the name from the parameter, creating it if it doesn't exist.
     * @param {string} name - name of the topic that you seek.
     */
    public topic(topicName: string): any {
        // Is our topic present?
        let presence = this.topicExists(topicName);

        // If not present, create new topic
        if (presence === -1) {
            presence = this.registerTopic(topicName); 
        }

        // Return topic
        return this.topics[presence];
    }

    /**
     * Registers a new topic to the Event bus. If the topic is already present, no action will be taken.
     * @param {string} name - name of the new topic
     */
    private registerTopic(topicName: string) {
        let newTopic = new Topic(topicName);
        this.topics.push(newTopic);

        return this.topics.length;
    }

    /**
     * Checks if the topic exists in the topic collection
     * @param {type} topicName -  the name of the topic
     */
    private topicExists(topicName: string): number {
        // Cycle through every topic and return one if found
        // Else return -1
        for (let i = 0; i < this.topics.length; i++) {
            if (this.topics[i].getName() === topicName) {
                // Found it, return it
                return i;
            }
        }

        // Not found, return -1
        return -1;
    }
}
