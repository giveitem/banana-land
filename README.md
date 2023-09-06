# AWS Data Restore
Team Banana-Land: @Janecching, @ScarStarS,  @giveitem, @asana-boop

## Introduction
MCIT Online currently utilizes the student-created web platform OHQ for managing private TA
office hour queues. However, due to the platform’s limited functionalities, MCIT Online is planning
on transitioning to a new platform to better serve student and programmatic needs. Our team is
proposing to address some of the current shortcomings of the OHQ platform.

## Selected Project
We have selected Data Restore as our project topic. The requirements for Data Restore are as
follows:
* Create an RDS database.
* Populate it with content with simple data types (e.g. text, number, datetime); at least 100K
rows.
* The content should be modified (either new rows created, deleted or modified every 5 min
through some automated process).
* Create a scheduled "backup" that reads the data periodically (e.g. once per hour) and
outputs the data to an S3 object.
* The S3 object should be copied to a different region (e.g. from us-east-1 to us-west-2)
periodically and labeled in such a way that it can be uniquely identified based on time the
"backup" was taken.
* Write a script that reads the data from a specified S3 "backup" object into a new, different
type of database.

## Proposed Design
1. High-Level Overview
   Our proposed design is to create an RDS database. User information such as user hierarchy
will originally be stored in Aurora and eventually migrated to DynamoDB. To improve the
storage solution, we want to migrate the user information from the old database (Aurora) to
DynamoDB. Chat history will be stored in DynamoDB as it supports the level of granularity
we need to see messages appearing in order in real-time.

2. Further Explanation
   We implement a VPC design as follows:
   ![image](https://github.com/giveitem/banana-land/assets/49624400/77ed58d0-242a-46bb-a75a-026c1d772eda)

  We populate our Aurora database with more than 100,000 records using a Java program and
a Java Lambda function that automatically updates, inserts, or deletes 10 rows of user
information every five minutes. The Lambda function is used in conjunction with AWS SDKs
to interact with the Aurora database to constantly update user information.

  We include a timestamp attribute in the chat message records to represent the order in
which messages are created. This timestamp is formatted for easy sorting and serves as the
sort key to ensure messages within a partition are ordered by their timestamps. When
retrieving chat history, we perform a query using the sort key, employing comparison
operators (such as greater than or less than) to access messages within a specific time
range. The timestamp is also set as the partition key for the Global Secondary Index (GSI).
Since all course staff members can access the full history, we only need to identify the staff
member answering a student's question. Additionally, we primarily query by time to examine
specific time windows within the chat history.

  Additionally, for disaster recovery or backup purposes, we implement a scheduled "backup"
process that periodically reads data from our Aurora database and exports it to an S3
object. This S3 object is then copied to a different region, specifically from us-east-2 (Ohio)
to us-west-1 (Northern California), using a Python Lambda function. The backup is labeled
based on the time it was taken. It's worth noting that the University of Pennsylvania is
located in the us-east-1 region, but us-east-2 and us-west-1 are chosen because they are
the most cost-effective options.

  To efficiently manage data migration and ensure cost-efficiency, we utilize S3 for backfilling
data into DynamoDB. The API is implemented using the SDK, and this process allows us to
back up user information from the Aurora database to an S3 object once per hour.

  Furthermore, we write a script that reads data from a specified S3 "backup" object into a
new, different type of database. To enhance the storage solution, we migrate the user
information from the old database (Aurora) to DynamoDB. Additionally, we create a feature
toggle to enable switching between Aurora and DynamoDB during the migration process.


## System Architecture
![image](https://github.com/giveitem/banana-land/assets/49624400/78600956-8f4c-49ab-a739-0aa6854ed042)


## Data Model
Chat history will be implemented using DynamoDB. The proposed structure is the following:
* Each organization will have an independent database administrator account.
* Each course will have a unique DynamoDB table.
* The student user ID will be the partition key.
* Include the staff user ID, who is chatting with the student, as an attribute.
* Use the Unix timestamp as the sort key.
* Create a global secondary index, setting the staff user ID as the partition key, and the Unix
timestamp as the sort key. This allows anyone involved in the same chat to query the chat
history.

  User information will be implemented using Aurora, and DynamoDB will be utilized as part of the
migration requirement. Each client will have their own administrator account, and each course for
the client will have a unique DynamoDB table to store either user information data or chat history
data within the same administrator account. The proposed DynamoDB and Aurora table designs are
as follows:
1. DynamoDB table design
   
![image](https://github.com/giveitem/banana-land/assets/49624400/38375b48-9951-488a-8438-d7bbf9440ca5)

2. Aurora table design
   
![image](https://github.com/giveitem/banana-land/assets/49624400/b9742ba4-c438-484f-852a-9a4c754dd2f2)


## Business Logic
  Since the OHQ platform functions as an office hours queue, we need the ability to store students'
data, which we maintain in a table. This data also requires regular updates. For this purpose, we
need an object store, so we utilize S3.

  The existing office hours queue platform lacks a sufficient backup system. As a result, students are unable to access their previous OHQ history. Our objective is to enable students to view their
previously asked questions. Therefore, we need to maintain a table and ensure efficient lookups for
each student.

## Migration Strategy
  To improve the storage solution, we want to migrate the user information from the old database
(Aurora) to DynamoDB. Additionally, we will create a feature toggle to allow switching between
Aurora and DynamoDB during the migration process.

## Impact
  By utilizing DynamoDB, which is hash-based, we optimized performance as well. Basic operations
in DynamoDB have an O(1) time complexity. This is in contrast to an Aurora database, where the
time complexity can range from O(log n) to O(n).

  Regarding security, AWS is a managed service. We implemented cross-region replication, which
provides added security, and utilized Point In Time Recovery (PITR) through DynamoDB.

  An added advantage is that our code is modular and reusable. Consequently, it can be easily
adapted for another team's project.

  Additionally, the current OHQ platform does not have a backup option. In our proposed solution,
we periodically backup older data to S3 for long-term storage. For example, when a course is
complete, that data will no longer need to be frequently accessed. Therefore, we can archive the
data to S3 and delete the now archived data in the DynamoDB table to reduce costs.

  Finally, by implementing a toggle feature, we achieve zero downtime during deployment, ensuring
uninterrupted access to user data throughout the migration process. This seamless transition to
DynamoDB enhances our storage solution’s scalability, performance, and reliability.
