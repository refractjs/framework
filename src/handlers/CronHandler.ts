import { CronJob } from "cron";
import { RefractClient } from "../RefractClient";
import { Piece } from "../piece/Piece";
import { HandlerMetadata, PieceHandler } from "./PieceHandler";
import { Collection } from "discord.js";

export interface CronHandlerMetadata extends HandlerMetadata {
  time: string;
  beforeReady: boolean;
  runOnInit: boolean;
  timezone: string | null;
}

export class CronHandler extends PieceHandler {
  public jobs: Collection<CronHandlerMetadata, CronJob>;

  public constructor(client: RefractClient) {
    super(client, "cron");

    this.jobs = new Collection();
  }

  public async register(piece: Piece, options: CronHandlerMetadata) {
    if (options.runOnInit) {
      options.beforeReady = true;
    }
    const job = CronJob.from({
      cronTime: options.time,
      timeZone: options.timezone,
      runOnInit: options.runOnInit,
      onTick: () => {
        if (!options.beforeReady && !this.client.isReady()) return;
        piece[options.propertyKey]();
      },
    });

    job.start();
    this.jobs.set(options, job);
  }

  public async unregister(_piece: Piece, options: CronHandlerMetadata) {
    const job = this.jobs.get(options);
    if (job) {
      job.stop();
      this.jobs.delete(options);
    }
  }
}
