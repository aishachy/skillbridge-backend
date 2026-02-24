import { prisma } from "../../lib/prisma";
import { AvailabilityStatus } from "@prisma/client";

interface CreateAvailabilityInput {
  userId: number;
  startTime: Date;
  endTime: Date;
  status?: AvailabilityStatus;
}

interface UpdateAvailabilityInput {
  startTime?: Date | undefined;
  endTime?: Date | undefined;
  status?: AvailabilityStatus | undefined;
}

export const tutorAvailabilityService = {
  async create(data: CreateAvailabilityInput) {
    const profile = await prisma.tutorProfiles.findUnique({
      where: { userId: data.userId },
      select: { id: true }
    });

    if (!profile) {
      throw new Error("No tutor profile found for this user. Create a profile first.");
    }

    if (data.startTime >= data.endTime) {
      throw new Error("Start time must be before end time");
    }

    // overlap check
    const overlap = await prisma.tutorAvailability.findFirst({
      where: {
        tutorId: profile.id,
        AND: [
          { startTime: { lt: data.endTime } },
          { endTime: { gt: data.startTime } }
        ]
      }
    });

    if (overlap) {
      throw new Error("Slot overlaps with existing availability");
    }

    return prisma.tutorAvailability.create({
      data: {
        tutorId: profile.id,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status ?? AvailabilityStatus.AVAILABLE
      }
    });
  },

  async update(id: number, data: UpdateAvailabilityInput) {
    const existing = await prisma.tutorAvailability.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new Error("Slot not found");
    }

    const start = data.startTime ?? existing.startTime;
    const end = data.endTime ?? existing.endTime;

    if (start >= end) {
      throw new Error("Invalid time range");
    }

    const overlap = await prisma.tutorAvailability.findFirst({
      where: {
        tutorId: existing.tutorId,
        id: { not: id },
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } }
        ]
      }
    });

    if (overlap) {
      throw new Error("Updated slot overlaps another slot");
    }

    const updateData: any = {};

    if (data.startTime !== undefined) updateData.startTime = data.startTime;
    if (data.endTime !== undefined) updateData.endTime = data.endTime;
    if (data.status !== undefined) updateData.status = data.status;

    return prisma.tutorAvailability.update({
      where: { id },
      data: updateData
    });
  },

  async getMine(userId: number) {
    const profile = await prisma.tutorProfiles.findUnique({
      where: { userId }
    });

    if (!profile) return [];

    return prisma.tutorAvailability.findMany({
      where: { tutorId: profile.id },
      orderBy: { startTime: "asc" }
    });
  },

  async getAvailable(tutorProfileId: number) {
    return prisma.tutorAvailability.findMany({
      where: {
        tutorId: tutorProfileId,
        status: AvailabilityStatus.AVAILABLE
      },
      orderBy: { startTime: "asc" }
    });
  },

  async delete(id: number) {
    const slot = await prisma.tutorAvailability.findUnique({
      where: { id }
    });

    if (!slot) {
      throw new Error("Slot not found");
    }

    if (slot.status === AvailabilityStatus.BOOKED) {
      throw new Error("Cannot delete booked slot");
    }

    return prisma.tutorAvailability.delete({
      where: { id }
    });
  }
};