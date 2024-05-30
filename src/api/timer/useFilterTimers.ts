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

const useFilterTimers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;

  const userDocRef = doc(db, "users", user!.uid);

  const filter = async (
    startDate?: string,
    endDate?: string,
    description?: string
  ) => {
    try {
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const closedTimers = docSnap
          .data()
          .timers.filter((timer) => timer.status === "closed");

        if (description == "") {
          if (startDate && endDate) {
            return filterByStartAndEndDate(closedTimers, startDate, endDate);
          } else if (startDate) {
            return filterByStartDate(closedTimers, startDate);
          } else if (endDate) {
            return filterByEndDate(closedTimers, endDate);
          } else {
            // return all closedTimers if no description got passed
            return closedTimers;
          }
        }

        if (description && description !== "") {
          if (startDate && endDate) {
            const filters = filterByStartAndEndDate(
              closedTimers,
              startDate,
              endDate
            );

            const combined = filterByDescription(filters, description);

            return combined;
          } else if (startDate) {
            const filters = filterByStartDate(closedTimers, startDate);
            const combined = filterByDescription(filters, description);

            return combined;
          } else if (endDate) {
            const filters = filterByEndDate(closedTimers, endDate);
            const combined = filterByDescription(filters, description);

            return combined;
          } else {
            const filters = filterByDescription(closedTimers, description);
            return filters;
          }
        }

        // find span
        if (startDate && endDate) {
          const filters = filterByStartAndEndDate(
            closedTimers,
            startDate,
            endDate
          );

          return filters;
        }

        if (startDate) {
          const filters = filterByStartDate(closedTimers, startDate);

          return filters;
        }

        if (endDate) {
          const filters = filterByEndDate(closedTimers, endDate);

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

export default useFilterTimers;
