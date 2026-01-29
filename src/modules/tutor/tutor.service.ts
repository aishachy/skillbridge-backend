import { TutorProfiles } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createTutor = async (data: TutorProfiles) => {
  const result = await prisma.tutorProfiles.create({
    data
  })
  return result;
}

const getAllTutors = async (data: TutorProfiles) => {
  const result = await prisma.tutorProfiles.findMany({
    where: {
      user: {
        role: "TUTOR"
      }
    },
    include: {
      user: true,
      reviews: true,
      bookings: true,
      category: true
    }
  })
  return result;
}

const getTutorById = async (id: number) => {
  const result = await prisma.tutorProfiles.findUnique({
    where: { id },
    include: {
      user: true,
      reviews: true,
      bookings: true,
      category: true
    }
  })
  return result
}

const updateTutor = async (data: TutorProfiles, tutorId: number) => {
  const result = await prisma.tutorProfiles.update({
    where: {
      id: tutorId
    },
    data
  })
  return result
}

interface updateProfileInput {
  name?: string
  bio?: string
  education?: string
  experience?: string
  perHourRate?: string
  location?: string
}

const updateTutorProfile = async (data: updateProfileInput, tutorId: number) => {
  const result = prisma.tutorProfiles.update({
    where: { id: tutorId },
    data
  });
  return result
}

export const tutorService = {
  createTutor,
  getAllTutors,
  getTutorById,
  updateTutor,
  updateTutorProfile
}