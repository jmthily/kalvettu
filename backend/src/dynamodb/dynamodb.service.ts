import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

/** Thin DynamoDB document client wrapper */
@Injectable()
export class DynamoDbService implements OnModuleInit {
  private client!: DynamoDBDocumentClient;
  private tables!: {
    profiles: string;
    people: string;
    invites: string;
    contributors: string;
    stories: string;
    media: string;
    admins: string;
  };

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const region = this.config.get<string>('aws.region');
    const ddb = new DynamoDBClient({ region });
    this.client = DynamoDBDocumentClient.from(ddb, {
      marshallOptions: { removeUndefinedValues: true },
    });
    this.tables = this.config.get('dynamodb') as typeof this.tables;
  }

  table(name: keyof typeof this.tables): string {
    return this.tables[name];
  }

  async get<T>(table: string, key: Record<string, unknown>): Promise<T | null> {
    const res = await this.client.send(
      new GetCommand({ TableName: table, Key: key }),
    );
    return (res.Item as T) ?? null;
  }

  async put(table: string, item: object): Promise<void> {
    await this.client.send(new PutCommand({ TableName: table, Item: item }));
  }

  async query<T>(
    table: string,
    params: Omit<ConstructorParameters<typeof QueryCommand>[0], 'TableName'>,
  ): Promise<T[]> {
    const res = await this.client.send(
      new QueryCommand({ TableName: table, ...params }),
    );
    return (res.Items as T[]) ?? [];
  }

  async update(
    table: string,
    key: Record<string, unknown>,
    updates: Record<string, unknown>,
  ): Promise<void> {
    const names: Record<string, string> = {};
    const values: Record<string, unknown> = {};
    const parts: string[] = [];
    let i = 0;
    for (const [k, v] of Object.entries(updates)) {
      const nk = `#k${i}`;
      const vk = `:v${i}`;
      names[nk] = k;
      values[vk] = v;
      parts.push(`${nk} = ${vk}`);
      i++;
    }
    await this.client.send(
      new UpdateCommand({
        TableName: table,
        Key: key,
        UpdateExpression: `SET ${parts.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      }),
    );
  }

  async delete(table: string, key: Record<string, unknown>): Promise<void> {
    await this.client.send(new DeleteCommand({ TableName: table, Key: key }));
  }

  async scan<T>(
    table: string,
    params: Omit<ConstructorParameters<typeof ScanCommand>[0], 'TableName'> = {},
  ): Promise<T[]> {
    const items: T[] = [];
    let lastKey: Record<string, unknown> | undefined;

    do {
      const res = await this.client.send(
        new ScanCommand({
          TableName: table,
          ...params,
          ExclusiveStartKey: lastKey,
        }),
      );
      if (res.Items?.length) items.push(...(res.Items as T[]));
      lastKey = res.LastEvaluatedKey;
    } while (lastKey);

    return items;
  }
}
