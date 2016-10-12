class Channel {
    private topics: any = [];

    constructor(private name: string) { }

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
