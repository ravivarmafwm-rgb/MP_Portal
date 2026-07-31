<?php

namespace App\Policies;

use App\Policies\Concerns\AuthorizesMeetingRecords;

class AppointmentPolicy
{
    use AuthorizesMeetingRecords;
}
