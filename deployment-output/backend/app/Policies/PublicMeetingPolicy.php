<?php

namespace App\Policies;

use App\Policies\Concerns\AuthorizesMeetingRecords;

class PublicMeetingPolicy
{
    use AuthorizesMeetingRecords;
}
