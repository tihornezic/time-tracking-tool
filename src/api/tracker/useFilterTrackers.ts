import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import {
  filterByDescription,
  filterByEndDate,
  filterByStartAndEndDate,
  filterByStartDate,
} from "../../helpers/helpers";
import { EnumTrackerStatus, Tracker } from "../../types/types";

const useFilterTrackers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;

  const userDocRef = doc(db, "users", user!.uid);

  const filter = async (
    startDate?: Date,
    endDate?: Date,
    description?: string
  ) => {
    console.log(typeof startDate);

    try {
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const closedTrackers = docSnap
          .data()
          .trackers.filter(
            (tracker: Tracker) => tracker.status === EnumTrackerStatus.closed
          );

        if (description == "") {
          if (startDate && endDate) {
            return filterByStartAndEndDate(closedTrackers, startDate, endDate);
          } else if (startDate) {
            return filterByStartDate(closedTrackers, startDate);
          } else if (endDate) {
            return filterByEndDate(closedTrackers, endDate);
          } else {
            // return all closedTrackers if no description got passed
            return closedTrackers;
          }
        }

        if (description && description !== "") {
          if (startDate && endDate) {
            const filters = filterByStartAndEndDate(
              closedTrackers,
              startDate,
              endDate
            );

            const combined = filterByDescription(filters, description);

            return combined;
          } else if (startDate) {
            const filters = filterByStartDate(closedTrackers, startDate);
            const combined = filterByDescription(filters, description);

            return combined;
          } else if (endDate) {
            const filters = filterByEndDate(closedTrackers, endDate);
            const combined = filterByDescription(filters, description);

            return combined;
          } else {
            const filters = filterByDescription(closedTrackers, description);
            return filters;
          }
        }

        // find span
        if (startDate && endDate) {
          const filters = filterByStartAndEndDate(
            closedTrackers,
            startDate,
            endDate
          );

          return filters;
        }

        if (startDate) {
          const filters = filterByStartDate(closedTrackers, startDate);

          return filters;
        }

        if (endDate) {
          const filters = filterByEndDate(closedTrackers, endDate);

          return filters;
        }
      } else {
        throw new Error("No such document!");
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;

        setIsLoading(false);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    }
  };

  return { filter, isLoading, error };
};

export default useFilterTrackers;
